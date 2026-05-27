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

    /* ================= CREATE DISPUTE ================= */

    const dispute = await DisputeModel.create({
      dispute_type: req.body.dispute_type,

      dispute_type_id: req.body.dispute_type_id,

      dispute_reason: req.body.dispute_reason,

      assigned_to: req.body.assigned_to,

      priority: req.body.priority,

      followups: JSON.stringify(followups),

      date: entry_date,

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

exports.updateAudit = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= PARSE PRODUCTS ================= */

    let auditItems = [];

    if (req.body.auditItems) {
      auditItems =
        typeof req.body.auditItems === "string"
          ? JSON.parse(req.body.auditItems)
          : req.body.auditItems;
    }

    /* ================= UPDATE ENQUIRY ================= */

    await AuditModel.update(
      {
        company_id: req.body.company_id,
        compliance_status: req.body.compliance_status,
        compliance_remark: req.body.compliance_remark
      },
      { where: { id } }
    );

    /* ================= DELETE OLD PRODUCTS ================= */

    await AuditProductsModel.destroy({
      where: { audit_id: id }
    });

    /* ================= ADD NEW PRODUCTS ================= */

    const productRows = auditItems.map((p, index) => {
      return {
        audit_id: id,
        product_id: p.product_id,
        grade: p.grade,
        auditor_name: p.auditor_name
      };
    });

    if (productRows.length) {
      await AuditProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Audit Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await AuditProductsModel.destroy({
      where: { audit_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await AuditModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Audit Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
