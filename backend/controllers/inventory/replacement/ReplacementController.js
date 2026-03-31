const db = require("../../../models");
const { ReplacementModel, Invoice, DispatchVehicle, WorkOrderModel } = db;

exports.index = async (req, res, next) => {
  try {
    const data = await ReplacementModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Invoice,
          as: "invoices",
          attributes: ["id", "invoice_no"]
        }
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
    const invoice_id = req.body.invoice_no;

    /* ================= CREATE WORK ORDER ================= */
    if (invoice_id) {
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
    }

    /* ================= CREATE REPLACEMENT ================= */
    const data = await ReplacementModel.create({
      ...req.body,
      user_id: req.admin.id
    });

    res.status(201).json({
      message: "Replacement created successfully",
      data
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
