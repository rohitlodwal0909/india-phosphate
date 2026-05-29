const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  DisputeModel,
  AuditModel,
  AuditProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product,
  PurchaseOrderModel,
  SampleRequestModel
} = db;

exports.getpoandsample = async (req, res) => {
  try {
    const type = req.params.name;

    let data = [];

    // ================= PO =================

    if (type === "po") {
      data = await PurchaseOrderModel.findAll({
        order: [["id", "DESC"]],
        attributes: ["id", "po_no"]
      });
    }

    // ================= SAMPLE =================
    else if (type === "sample") {
      data = await SampleRequestModel.findAll({
        order: [["id", "DESC"]],
        attributes: ["id", "sr_no"]
      });
    }

    // ================= INVALID TYPE =================
    else {
      return res.status(400).json({
        message: "Invalid type"
      });
    }

    // ================= RESPONSE =================

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

exports.getDisputes = async (req, res) => {
  try {
    const disputes = await DisputeModel.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"]
        },
        {
          model: User,
          as: "assign_to",
          attributes: ["id", "username"]
        },
        {
          model: PurchaseOrderModel,
          as: "purchase_order",
          required: false
        },
        {
          model: SampleRequestModel,
          as: "sample_request",
          required: false
        }
      ],
      order: [["id", "DESC"]]
    });

    res.json(disputes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.storeDispute = async (req, res) => {
  try {
    /* ================= FOLLOWUPS ================= */

    let followups = [];

    if (req.body.followups) {
      followups =
        typeof req.body.followups === "string"
          ? JSON.parse(req.body.followups)
          : req.body.followups;
    }

    const { entry_date } = getISTDateTime();

    let pdf_file = null;

    if (req.file) {
      pdf_file = req.file.filename;
    }

    /* ================= CREATE DISPUTE ================= */

    const dispute = await DisputeModel.create({
      dispute_type: req.body.dispute_type,

      dispute_type_id: req.body.dispute_type_id,

      dispute_reason: req.body.dispute_reason,

      assigned_to: req.body.assigned_to,

      priority: req.body.priority,

      followups: JSON.stringify(followups),

      date: entry_date,
      pdf_file: pdf_file,

      user_id: req.admin.id
    });

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Dispute Created Successfully",
      dispute_id: dispute.id
    });
  } catch (error) {
    console.error("STORE DISPUTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDispute = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= CHECK DISPUTE ================= */

    const dispute = await DisputeModel.findByPk(id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found"
      });
    }

    /* ================= FOLLOWUPS ================= */

    let followups = [];

    if (req.body.followups) {
      followups =
        typeof req.body.followups === "string"
          ? JSON.parse(req.body.followups)
          : req.body.followups;
    }

    /* ================= PDF ================= */

    let pdf_file = dispute.pdf_file;

    if (req.file) {
      pdf_file = req.file.filename;
    }

    /* ================= UPDATE DISPUTE ================= */

    await DisputeModel.update(
      {
        dispute_type: req.body.dispute_type,

        dispute_type_id: req.body.dispute_type_id,

        dispute_reason: req.body.dispute_reason,

        assigned_to: req.body.assigned_to,

        priority: req.body.priority,

        followups: JSON.stringify(followups),

        pdf_file: pdf_file
      },
      {
        where: { id }
      }
    );

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Dispute Updated Successfully ✅"
    });
  } catch (error) {
    console.error("UPDATE DISPUTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE MAIN ENQUIRY ================= */
    await DisputeModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Dispute Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
