const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, RmCode, RMIssueModel, RMIssueAllocation, Qcbatch, ProductionResult, RMProductionReturn, RMWarehouseTransfer, StockMaster, sequelize } = db;

const buildRMStockRows = async (rmId, transaction, excludeIssueId = null) => {
  const rm = await RmCode.findByPk(rmId, { transaction });
  if (!rm) return null;
  const grns = await GrnEntry.findAll({
    where: { store_rm_code: rm.rm_code, type: "material", qa_qc_status: "APPROVED" },
    order: [["grn_date", "ASC"], ["id", "ASC"]],
    transaction
  });
  const ids = grns.map((row) => row.id);
  const [issues, returns, transfers] = await Promise.all([
    RMIssueModel.findAll({ where: { rm_id: rm.id }, order: [["created_at", "ASC"], ["id", "ASC"]], transaction }),
    ids.length ? RMProductionReturn.findAll({ where: { grn_entry_id: ids }, transaction }) : [],
    ids.length ? RMWarehouseTransfer.findAll({ where: { grn_entry_id: ids }, transaction }) : []
  ]);
  const issueIds = issues.map((issue) => issue.id);
  const allocations = issueIds.length ? await RMIssueAllocation.findAll({ where: { issue_id: issueIds }, transaction }) : [];
  const rows = grns.map((entry) => ({
    id: entry.id,
    grn_number: entry.grn_number,
    date: entry.grn_date,
    total_quantity: Number(entry.quantity || 0),
    unit: entry.unit || rm.unit,
    qc_reference: entry.qc_ref || "",
    issued_quantity: 0,
    remaining_quantity: Number(entry.quantity || 0),
    production_return_quantity: 0,
    transferred_quantity: 0,
    transfers: [],
    returns: []
  }));

  const allocatedIssueIds = new Set();
  allocations.forEach((allocation) => {
    if (allocation.issue_id === excludeIssueId) return;
    const row = rows.find((item) => item.id === allocation.grn_entry_id);
    if (!row) return;
    row.issued_quantity += Number(allocation.quantity || 0);
    allocatedIssueIds.add(allocation.issue_id);
  });

  // Existing issue entries do not have persisted receipt allocations. Allocate
  // only those legacy issues FIFO; new issue entries save their allocations.
  for (const issue of issues.filter((item) => item.id !== excludeIssueId && !allocatedIssueIds.has(item.id))) {
    let pending = Number(issue.quantity || 0);
    for (const row of rows) {
      if (pending <= 0) break;
      const allocatable = Math.max(0, row.total_quantity - row.issued_quantity);
      const allocated = Math.min(allocatable, pending);
      row.issued_quantity += allocated;
      pending -= allocated;
    }
  }
  rows.forEach((row) => { row.remaining_before_transfer = Math.max(0, row.total_quantity - row.issued_quantity); row.remaining_quantity = row.remaining_before_transfer; });
  returns.forEach((entry) => {
    const row = rows.find((item) => item.id === entry.grn_entry_id);
    if (row) { row.production_return_quantity += Number(entry.quantity || 0); row.returns.push(entry); }
  });
  transfers.forEach((entry) => {
    const row = rows.find((item) => item.id === entry.grn_entry_id);
    if (row) { row.transferred_quantity += Number(entry.quantity || 0); row.transfers.push(entry); }
  });
  rows.forEach((row) => {
    const transfer_from_returns = Math.max(0, row.transferred_quantity - row.remaining_before_transfer);
    row.remaining_quantity = Math.max(0, row.remaining_before_transfer - row.transferred_quantity);
    row.total_available = row.remaining_quantity + Math.max(0, row.production_return_quantity - transfer_from_returns);
    delete row.remaining_before_transfer;
  });
  return { rm, rows, issues: issues.filter((item) => item.id !== excludeIssueId), returns, transfers };
};

const getRMPhysicalAvailable = async (rmId, transaction, excludeIssueId = null) => {
  const stock = await buildRMStockRows(rmId, transaction, excludeIssueId);
  if (!stock) return null;
  const opening = Number(stock.rm.opening_stock || 0);
  const receipt = stock.rows.reduce((sum, row) => sum + row.total_quantity, 0);
  const issued = stock.issues.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const returned = stock.returns.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const moved = stock.transfers.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  return { stock, available: opening + receipt + returned - issued - moved };
};

exports.getStoreRM = async (req, res, next) => {
  try {
    const equipments = await RmCode.findAll({
      include: [
        {
          model: GrnEntry,
          as: "rmcodes",
          attributes: ["quantity", "unit"],
          where: {
            type: "material",
            qa_qc_status: "APPROVED"
          },
          required: false
        },
        {
          model: RMIssueModel,
          as: "issuedRawMaterial",
          attributes: ["quantity"],
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const data = await Promise.all(equipments.map(async (eq) => {
      const openingQty = Number(eq.opening_stock || 0);
      const stock = await buildRMStockRows(eq.id);
      const grnTotal = stock?.rows.reduce((sum, item) => sum + item.total_quantity, 0) || 0;
      const issuedTotal = stock?.issues.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
      const returnedTotal = stock?.returns.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
      const transferredTotal = stock?.transfers.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
      const totalQuantity = openingQty + grnTotal - issuedTotal + returnedTotal - transferredTotal;

      return {
        id: eq.id,
        code: eq.rm_code,
        name: eq.name || eq.rm_code,
        unit: eq.rmcodes?.length ? eq.rmcodes[0].unit : null,
        opening_stock: openingQty,
        grn_quantity: grnTotal,
        issued_quantity: issuedTotal,
        total_quantity: totalQuantity
      };
    }));

    return res.status(200).json({
      success: true,
      message: "Store RM fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.getRMStockTracking = async (req, res, next) => {
  try {
    const rmId = Number(req.params.rmId);
    if (!Number.isInteger(rmId) || rmId <= 0) return res.status(400).json({ message: "Invalid raw material." });
    const stock = await buildRMStockRows(rmId);
    if (!stock) return res.status(404).json({ message: "Raw material not found." });
    const totals = stock.rows.reduce((result, row) => ({
      total_quantity: result.total_quantity + row.total_quantity,
      remaining_quantity: result.remaining_quantity + row.remaining_quantity,
      issued_quantity: result.issued_quantity + row.issued_quantity,
      production_return_quantity: result.production_return_quantity + row.production_return_quantity,
      total_available: result.total_available + row.total_available
    }), { total_quantity: 0, remaining_quantity: 0, issued_quantity: 0, production_return_quantity: 0, total_available: 0 });
    return res.json({ material: { id: stock.rm.id, name: stock.rm.name, code: stock.rm.rm_code, unit: stock.rm.unit }, rows: stock.rows, totals });
  } catch (error) { next(error); }
};

exports.addRMProductionReturn = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const rmId = Number(req.params.rmId);
    const grnId = Number(req.body.grn_entry_id);
    const quantity = Number(req.body.quantity);
    const productionBatch = String(req.body.production_batch || "").trim();
    if (!Number.isInteger(rmId) || !Number.isInteger(grnId) || !Number.isFinite(quantity) || quantity <= 0 || !productionBatch) {
      const error = new Error("Select a valid arrival, enter a return quantity, and provide the production batch."); error.status = 400; throw error;
    }
    await RmCode.findByPk(rmId, { transaction, lock: transaction.LOCK.UPDATE });
    const grn = await GrnEntry.findByPk(grnId, { transaction, lock: transaction.LOCK.UPDATE });
    const stock = await buildRMStockRows(rmId, transaction);
    if (!grn || !stock || grn.store_rm_code !== stock.rm.rm_code || grn.qa_qc_status !== "APPROVED" || grn.type !== "material") {
      const error = new Error("The selected approved material arrival was not found."); error.status = 404; throw error;
    }
    const row = stock.rows.find((item) => item.id === grnId);
    const returnable = Math.max(0, Number(row?.issued_quantity || 0) - Number(row?.production_return_quantity || 0));
    if (quantity > returnable) { const error = new Error(`Return quantity cannot exceed the issued quantity available for return (${returnable}).`); error.status = 400; throw error; }
    const returned = await RMProductionReturn.create({ grn_entry_id: grnId, quantity, production_batch: productionBatch, note: String(req.body.note || "").trim() || null, user_id: req.admin.id }, { transaction });
    await transaction.commit();
    return res.status(201).json({ message: "Production return recorded.", data: returned });
  } catch (error) {
    await transaction.rollback();
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

exports.transferRMToWarehouse = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const rmId = Number(req.params.rmId);
    const grnId = Number(req.body.grn_entry_id);
    if (!Number.isInteger(rmId) || !Number.isInteger(grnId)) { const error = new Error("Invalid material arrival."); error.status = 400; throw error; }
    await RmCode.findByPk(rmId, { transaction, lock: transaction.LOCK.UPDATE });
    const grn = await GrnEntry.findByPk(grnId, { transaction, lock: transaction.LOCK.UPDATE });
    const stock = await buildRMStockRows(rmId, transaction);
    if (!grn || !stock || grn.store_rm_code !== stock.rm.rm_code || grn.qa_qc_status !== "APPROVED" || grn.type !== "material") {
      const error = new Error("The selected approved material arrival was not found."); error.status = 404; throw error;
    }
    const row = stock.rows.find((item) => item.id === grnId);
    const quantity = Number(row?.total_available || 0);
    if (quantity <= 0) { const error = new Error("No available quantity to transfer. This arrival may already be transferred."); error.status = 400; throw error; }

    const existingStock = await StockMaster.findOne({ where: { item_type: "Raw Material", item_id: stock.rm.id, batch_no: grn.grn_number }, transaction, lock: transaction.LOCK.UPDATE });
    const warehouseStock = existingStock
      ? await existingStock.update({ quantity_in_stock: Number(existingStock.quantity_in_stock || 0) + quantity, last_updated_by: req.admin.id, last_updated_at: new Date() }, { transaction })
      : await StockMaster.create({ item_type: "Raw Material", item_id: stock.rm.id, item_name: stock.rm.name, item_code: stock.rm.rm_code, material_name: stock.rm.name, batch_no: grn.grn_number, uom: grn.unit || stock.rm.unit, quantity_in_stock: quantity, last_updated_by: req.admin.id, last_updated_at: new Date(), status: "Active" }, { transaction });
    const transfer = await RMWarehouseTransfer.create({ grn_entry_id: grnId, stock_id: warehouseStock.stock_id, quantity, user_id: req.admin.id }, { transaction });
    await transaction.commit();
    return res.status(201).json({ message: "Available material transferred to Warehouse Master.", quantity, data: transfer });
  } catch (error) {
    await transaction.rollback();
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

exports.saveIssuedRM = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { entry_date, entry_time } = getISTDateTime();
    const rmId = Number(req.body.rm_id);
    const quantity = Number(req.body.quantity);
    await RmCode.findByPk(rmId, { transaction, lock: transaction.LOCK.UPDATE });
    const available = await getRMPhysicalAvailable(rmId, transaction);
    if (!available) { const error = new Error("Raw material not found."); error.status = 404; throw error; }
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > available.available) {
      const error = new Error(`Issue quantity must be greater than zero and cannot exceed available stock (${Math.max(0, available.available)}).`); error.status = 400; throw error;
    }

    const data = await RMIssueModel.create({
      ...req.body,
      rm_id: rmId,
      quantity,
      user_id: req.admin.id,
      date: entry_date + entry_time
    }, { transaction });
    let unallocatedQuantity = quantity;
    const allocations = [];
    for (const row of available.stock.rows) {
      if (unallocatedQuantity <= 0) break;
      const allocated = Math.min(Number(row.total_available || 0), unallocatedQuantity);
      if (allocated > 0) {
        allocations.push({ issue_id: data.id, grn_entry_id: row.id, quantity: allocated });
        unallocatedQuantity -= allocated;
      }
    }
    if (allocations.length) await RMIssueAllocation.bulkCreate(allocations, { transaction });
    await transaction.commit();

    res.status(201).json({
      message: "Raw material issue successfully",
      data
    });
  } catch (error) {
    await transaction.rollback();
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

exports.getIssuedRM = async (req, res, next) => {
  try {
    const data = await RMIssueModel.findAll({
      include: [
        {
          model: RmCode,
          as: "issueRm"
        },
        {
          model: Qcbatch,
          attributes: ["id", "qc_batch_number"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res
      .status(200)
      .json({ message: "Issued Raw Material Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.getBatches = async (req, res, next) => {
  try {
    const batches = await Qcbatch.findAll({
      attributes: ["id", "qc_batch_number"],
      include: [
        {
          model: ProductionResult,
          as: "production_results",
          required: true,
          include: [
            {
              model: RmCode,
              as: "rmcodes"
            }
          ]
        }
      ]
    });

    res.status(200).json({ message: "Issued PM Fetched", data: batches });
  } catch (error) {
    next(error);
  }
};

exports.deleteIssuedRM = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let entry = await RMIssueModel.findByPk(req.params.id, { transaction });
    if (!entry) {
      await transaction.rollback();
      return res.status(404).json({ message: "Raw Material Entry not found" });
    }
    await RmCode.findByPk(entry.rm_id, { transaction, lock: transaction.LOCK.UPDATE });
    entry = await RMIssueModel.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!entry) { await transaction.rollback(); return res.status(404).json({ message: "Raw Material Entry not found" }); }

    await entry.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Raw Material Entry deleted" });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.updateIssuedRM = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body; // 🔑 id from URL
    let entry = await RMIssueModel.findByPk(id, { transaction });

    if (!entry) {
      await transaction.rollback();
      return res.status(404).json({ message: "Raw material issue entry not found" });
    }

    const rmId = Number(req.body.rm_id ?? entry.rm_id);
    const quantity = Number(req.body.quantity ?? entry.quantity);
    for (const lockId of [...new Set([Number(entry.rm_id), rmId])].sort((a, b) => a - b)) {
      await RmCode.findByPk(lockId, { transaction, lock: transaction.LOCK.UPDATE });
    }
    entry = await RMIssueModel.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!entry) { const error = new Error("Raw material issue entry not found"); error.status = 404; throw error; }
    const available = await getRMPhysicalAvailable(rmId, transaction, entry.id);
    if (!available) { const error = new Error("Raw material not found."); error.status = 404; throw error; }
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > available.available) {
      const error = new Error(`Issue quantity must be greater than zero and cannot exceed available stock (${Math.max(0, available.available)}).`); error.status = 400; throw error;
    }
    await RMIssueAllocation.destroy({ where: { issue_id: entry.id }, transaction });
    await entry.update({ ...req.body, rm_id: rmId, quantity }, { transaction });
    let unallocatedQuantity = quantity;
    const allocations = [];
    for (const row of available.stock.rows) {
      if (unallocatedQuantity <= 0) break;
      const allocated = Math.min(Number(row.total_available || 0), unallocatedQuantity);
      if (allocated > 0) {
        allocations.push({ issue_id: entry.id, grn_entry_id: row.id, quantity: allocated });
        unallocatedQuantity -= allocated;
      }
    }
    if (allocations.length) await RMIssueAllocation.bulkCreate(allocations, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Raw material issue updated successfully",
      data: entry
    });
  } catch (error) {
    await transaction.rollback();
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};
