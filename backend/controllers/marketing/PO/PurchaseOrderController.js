const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { PurchaseOrderModel, WorkOrderModel, User } = db;

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

exports.storePurchaseOrder = async (req, res) => {
  try {
    const data = await PurchaseOrderModel.create({
      ...req.body,
      user_id: req.admin.id
    });

    res.json({
      message: "Purchase Order Created",
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createWorkOrderNo = async (req, res) => {
  try {
    const { work_order_no, po_id, id } = req.body;

    if (!work_order_no) {
      return res.status(400).json({
        success: false,
        message: "Work Order No is required"
      });
    }

    // duplicate check
    const existing = await WorkOrderModel.findOne({
      where: { work_order_no }
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
          work_order_no
        },
        {
          where: { id }
        }
      );

      data = await WorkOrderModel.findByPk(id);

      return res.json({
        success: true,
        message: "Work Order Updated Successfully",
        data
      });
    } else {
      // CREATE
      data = await WorkOrderModel.create({
        po_id,
        work_order_no,
        user_id: req.admin.id
      });

      return res.json({
        success: true,
        message: "Work Order Created Successfully",
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
    await PurchaseOrderModel.update(req.body, {
      where: { id: req.params.id }
    });

    res.json({ message: "Purchase Order Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
