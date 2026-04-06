const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { PurchaseOrderModel, Customer, WorkOrderModel, User } = db;

exports.getPurchaseOrders = async (req, res) => {
  try {
    const data = await PurchaseOrderModel.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"]
        },
        {
          model: Customer,
          as: "customers"
        },
        {
          model: WorkOrderModel,
          as: "workNo",
          required: false
        }
      ]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storePurchaseOrder = async (req, res) => {
  try {
    let products = [];
    if (req.body.products) {
      products = JSON.parse(req.body.products);
    }

    const files = req.files || [];

    products = products.map((p, index) => {
      const file = files.find((f) => f.fieldname === `file_${index}`);
      if (file) {
        p.file = file.filename;
      }
      return p;
    });

    const data = await PurchaseOrderModel.create({
      ...req.body,
      products: JSON.stringify(products),
      user_id: req.admin.id
    });

    /* ================= AUTO WORK ORDER NO ================= */
    const lastWO = await WorkOrderModel.findOne({
      order: [["id", "DESC"]]
    });

    let work_order_no = "WO-001";

    if (lastWO && lastWO.work_order_no) {
      const lastNumber = parseInt(lastWO.work_order_no.split("-")[1]);
      const newNumber = lastNumber + 1;

      work_order_no = `WO-${String(newNumber).padStart(3, "0")}`;
    }

    /* ================= CREATE WORK ORDER ================= */
    await WorkOrderModel.create({
      po_id: data.id,
      work_order_no,
      user_id: req.admin.id
    });

    res.json({
      message: "Purchase Order Created",
      data,
      work_order_no
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const workOrder = await WorkOrderModel.findByPk(id);

    if (!workOrder) {
      return res.status(404).json({
        success: false,
        message: "Work Order not found"
      });
    }

    await workOrder.update({ status });

    let title = "Work Order Status";
    let message = "";

    if (status === "Approved") {
      message = `Work Order ${workOrder.work_order_no} has been approved.`;
    } else if (status === "Rejected") {
      message = `Work Order ${workOrder.work_order_no} has been rejected.`;
    } else {
      message = `Work Order ${workOrder.work_order_no} status updated to ${status}.`;
    }

    await createNotificationByRoleId({
      title,
      message,
      role_id: 3
    });

    res.json({
      success: true,
      message: `Work Order ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.paymentApproved = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find Purchase Order
    const po = await PurchaseOrderModel.findByPk(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found"
      });
    }

    // Update Status
    await po.update({ payment_status: status });

    // Notification Message
    let title = "Purchase Order Payment Status";
    let message = "";

    if (status === "Approved") {
      message = `Purchase Order ${po.po_no} Payment has been approved.`;
    } else if (status === "Rejected") {
      message = `Purchase Order ${po.po_no} Payment has been rejected.`;
    } else {
      message = `Purchase Order ${po.po_no} Payment status updated to ${status}.`;
    }

    // Create Notification
    await createNotificationByRoleId({
      title,
      message,
      role_id: 11
    });

    return res.status(200).json({
      success: true,
      message: `Purchase Order Payment ${status} successfully`
    });
  } catch (error) {
    console.error("paymentApproved Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addRemark = async (req, res) => {
  try {
    const { remark, po_id, id } = req.body;

    // duplicate check
    const existing = await WorkOrderModel.findOne({
      where: { po_id }
    });

    if (existing && existing.id !== id) {
      return res.status(400).json({
        success: false,
        message: "Work Order No already exists"
      });
    }

    let data;

    if (id) {
      // UPDATE
      await WorkOrderModel.update(
        {
          remark
        },
        {
          where: { id }
        }
      );

      data = await WorkOrderModel.findByPk(id);

      return res.json({
        success: true,
        message: "Remark Updated Successfully",
        data
      });
    } else {
      // CREATE
      data = await WorkOrderModel.create({
        po_id,
        remark,
        user_id: req.admin.id
      });

      return res.json({
        success: true,
        message: "Remark Created Successfully",
        data
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let products = [];

    // products JSON parse
    if (req.body.products) {
      products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    }

    // attach uploaded files to products
    if (req.files) {
      products = products.map((p, index) => {
        const file = req.files[`file_${index}`];
        if (file) {
          p.file = file[0].filename;
        }
        return p;
      });
    }

    const updateData = {
      // ✅ Basic
      po_no: req.body.po_no,
      company_id: req.body.company_id,
      company_type: req.body.company_type,
      company_address: req.body.company_address,
      delivery_address: req.body.delivery_address,
      customer_name: req.body.customer_name,

      // ✅ Products
      products: JSON.stringify(products),

      // ✅ Financial
      freight: req.body.freight,
      payment_terms: req.body.payment_terms,
      remark: req.body.remark,
      commission: req.body.commission,

      // ✅ Insurance
      insurance: req.body.insurance,
      insurance_remark: req.body.insurance_remark,

      // ✅ Type
      domestic: req.body.type === "domestic",
      export: req.body.type === "export",

      // ✅ Export Fields
      country_name: req.body.country_name,
      inco_term: req.body.inco_term,
      discharge_port: req.body.discharge_port,

      // ✅ Other
      customise_labels: req.body.customise_labels,
      expected_delivery_date: req.body.expected_delivery_date
    };

    await PurchaseOrderModel.update(updateData, {
      where: { id }
    });

    res.json({
      message: "Purchase Order Updated Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    await PurchaseOrderModel.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Purchase Order Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
