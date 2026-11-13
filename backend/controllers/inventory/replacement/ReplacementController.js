const db = require("../../../models");
const { ReplacementModel, Invoice, DispatchVehicle, WorkOrderModel, PurchaseOrderModel, PurchasePoModel, PurchasePoProductsModel, Product } = db;

exports.options = async (req, res, next) => {
  try {
    const [workOrders, purchaseOrders, purchasePos] = await Promise.all([
      WorkOrderModel.findAll({
        attributes: ["id", "work_order_no", "po_id"],
        include: [{ model: PurchaseOrderModel, as: "workNo", attributes: ["id", "po_no", "customer_name", "product_name", "quantity", "total"] }],
        order: [["id", "DESC"]]
      }),
      PurchaseOrderModel.findAll({ attributes: ["id", "po_no", "customer_name", "product_name", "quantity", "total"], order: [["id", "DESC"]] }),
      PurchasePoModel.findAll({
        attributes: ["id", "po_no", "date"],
        include: [{ model: PurchasePoProductsModel, as: "purchasePo", attributes: ["qty", "unit", "rate", "total"], include: [{ model: Product, as: "product", attributes: ["product_name"] }] }],
        order: [["id", "DESC"]]
      })
    ]);

    const poIds = [...new Set(workOrders.map((workOrder) => workOrder.po_id).filter(Boolean))];
    const dispatches = poIds.length ? await DispatchVehicle.findAll({
      where: { po_id: poIds },
      attributes: ["id", "po_id", "work_order_no", "dispatch_date", "product_name"],
      order: [["id", "DESC"]]
    }) : [];
    const dispatchIds = dispatches.map((dispatch) => dispatch.id);
    const invoices = dispatchIds.length ? await Invoice.findAll({
      where: { dispatch_id: dispatchIds },
      attributes: ["id", "dispatch_id", "invoice_no", "invoice_date", "transaction_type"],
      order: [["id", "DESC"]]
    }) : [];

    return res.status(200).json({ workOrders, purchaseOrders, purchasePos, dispatches, invoices });
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const data = await ReplacementModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Invoice,
          as: "invoices",
          attributes: ["id", "invoice_no"]
        },
        { model: WorkOrderModel, as: "workOrder", attributes: ["id", "work_order_no"] },
        { model: PurchaseOrderModel, as: "marketingPO", attributes: ["id", "po_no", "customer_name", "product_name", "quantity", "total"] },
        { model: PurchasePoModel, as: "purchasePO", attributes: ["id", "po_no", "date"], include: [{ model: PurchasePoProductsModel, as: "purchasePo", attributes: ["qty", "unit", "rate", "total"], include: [{ model: Product, as: "product", attributes: ["product_name"] }] }] },
        { model: DispatchVehicle, as: "dispatch", attributes: ["id", "dispatch_date", "vehicle_number", "work_order_no"] }
      ]
    });

    res.status(200).json({ message: "Replacement Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

// Create GRN Entry
exports.store = async (req, res, next) => {
  try {
    const { entries, ...sharedFields } = req.body;
    const rows = Array.isArray(entries) && entries.length
      ? entries.map((entry) => ({ ...sharedFields, ...entry }))
      : [sharedFields];

    /* ================= CREATE WORK ORDER ================= */
    /* if (invoice_id) {
      // 1️⃣ Find Invoice
      const invoice = await Invoice.findOne({
        where: { id: invoice_id },
        attributes: ["dispatch_id"]
      });

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // 2️⃣ Find Dispatch Vehicle
      const dispatch = await DispatchVehicle.findOne({
        where: { id: invoice.dispatch_id },
        attributes: ["po_id"]
      });

      if (!dispatch) {
        return res.status(404).json({ message: "Dispatch not found" });
      }

      // 3️⃣ Generate Work Order Number
      const lastWO = await WorkOrderModel.findOne({
        order: [["id", "DESC"]],
        attributes: ["work_order_no"]
      });

      let work_order_no = "WO-001";

      if (lastWO?.work_order_no) {
        const lastNumber = parseInt(lastWO.work_order_no.split("-")[1]) || 0;
        const newNumber = lastNumber + 1;
        work_order_no = `WO-${String(newNumber).padStart(3, "0")}`;
      }

      // 4️⃣ Create Work Order
      await WorkOrderModel.create({
        po_id: dispatch.po_id, // ✅ correct id
        work_order_no,
        user_id: req.admin.id
      });
    } */

    /* ================= CREATE REPLACEMENT ================= */
    const data = await ReplacementModel.bulkCreate(rows.map((row) => ({
      ...row,
      quantity: row.replacement_type === "short_qty" ? Number(row.quantity) : null,
      unit: row.replacement_type === "short_qty" ? row.unit : null,
      user_id: req.admin.id
    })));

    res.status(201).json({
      message: "Replacement created successfully",
      data: data.length === 1 ? data[0] : data
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.body;

    // check id
    if (!id) {
      return res.status(400).json({
        message: "Replacement id is required"
      });
    }

    // find record
    const replacement = await ReplacementModel.findByPk(id);

    if (!replacement) {
      return res.status(404).json({
        message: "Replacement not found"
      });
    }

    // update record
    const data = await replacement.update({
      ...req.body
    });

    return res.status(200).json({
      message: "Replacement updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check id
    if (!id) {
      return res.status(400).json({
        message: "Replacement id is required"
      });
    }

    // find record
    const replacement = await ReplacementModel.findByPk(id);

    if (!replacement) {
      return res.status(404).json({
        message: "Replacement not found"
      });
    }

    // update record
    await replacement.destroy();

    return res.status(200).json({
      message: "Replacement delete successfully"
    });
  } catch (error) {
    next(error);
  }
};
