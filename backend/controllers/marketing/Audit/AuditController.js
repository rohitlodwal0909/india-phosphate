const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  AuditModel,
  AuditProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product
} = db;

exports.getAudit = async (req, res) => {
  try {
    const data = await AuditModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: AuditProductsModel,
          as: "interested_products",
          required: true,

          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_name"]
            },
            {
              model: User,
              as: "sales_name"
            }
          ]
        },
        {
          model: Customer,
          as: "customers"
        },
        {
          model: User,
          as: "users"
        }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.storeAudit = async (req, res) => {
  try {
    /* ================= VALIDATION ================= */
    if (!req.body.company_id) {
      return res.status(400).json({
        success: false,
        message: "Company is required"
      });
    }

    /* ================= GET PRODUCTS ================= */
    let auditItems = [];

    if (req.body.auditItems) {
      auditItems =
        typeof req.body.auditItems === "string"
          ? JSON.parse(req.body.auditItems)
          : req.body.auditItems;
    }

    const { entry_date } = getISTDateTime();

    /* ================= SR NO GENERATION ================= */

    /* ================= CREATE ENQUIRY ================= */
    const audit = await AuditModel.create({
      company_id: req.body.company_id,
      arrival_date: req.body.arrival_date,
      compliance_status: req.body.compliance_status,
      compliance_remark: req.body.compliance_remark,
      note: req.body.note,
      audit_agenda: req.body.audit_agenda,
      user_id: req.admin.id
    });

    /* ================= STORE INTERESTED PRODUCTS ================= */
    if (auditItems.length > 0) {
      const productRows = auditItems.map((p) => ({
        audit_id: audit.id,
        product_id: p.product_id,
        grade: p.grade,
        auditor_name: p.auditor_name || p.auditor_name || null
      }));

      await AuditProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Audit Created Successfully",
      audit_id: audit.id
    });
  } catch (error) {
    console.error("STORE ENQUIRY ERROR:", error);

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
        company_id: req.body.company_id
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
