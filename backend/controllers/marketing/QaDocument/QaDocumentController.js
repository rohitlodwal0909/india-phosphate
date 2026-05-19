const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { QaDocumentModel, QaDocumentCoaModel, User, Notification, Customer } =
  db;

exports.getQaDocument = async (req, res) => {
  try {
    const userId = req.admin.id;
    // req.admin.role;

    const data = await QaDocumentModel.findAll({
      order: [["id", "DESC"]],

      include: [
        {
          model: QaDocumentCoaModel,
          as: "qa_document",
          required: false,
          include: [
            {
              model: User,
              as: "qa_persons",
              required: false
            },
            {
              model: User,
              as: "received_marketing",
              required: false
            },
            {
              model: User,
              as: "share_customer",
              required: false
            }
          ]
        },
        {
          model: Customer,
          as: "customers",
          required: false
        },
        {
          model: User,
          as: "users",
          required: false
        }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error("GET COA ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

exports.storeQaDocument = async (req, res) => {
  try {
    const { company_id, coaItems } = req.body;

    /* ================= DATE TIME ================= */

    const { entry_date, entry_time } = getISTDateTime();

    /* ================= CREATE QA DOCUMENT ================= */

    const qaDocument = await QaDocumentModel.create({
      user_id: req.admin.id,
      company_id,
      date: entry_date
    });

    /* ================= PREPARE COA ITEMS ================= */

    let coaRows = [];

    if (coaItems && coaItems.length > 0) {
      coaRows = coaItems.map((row) => ({
        qa_document_id: qaDocument.id,
        doc_name: row.doc_name,
        qa_person_id: row.qa_person_id,
        received_marketing_id: row.received_marketing_id,
        share_customer_by: row.share_customer_by,
        status: row.status,
        comment: row.comment
      }));

      /* ================= NOTIFICATIONS ================= */

      const notificationsData = coaItems.map((row) => ({
        user_id: row.qa_person_id,
        title: "New QA Document Assigned",
        message: `QA Document "${row.doc_name}" has been assigned to you.`,
        is_read: 0,
        date_time: `${entry_date} ${entry_time}`
      }));

      await Notification.bulkCreate(notificationsData);
    }

    /* ================= SAVE COA RECORDS ================= */

    if (coaRows.length > 0) {
      await QaDocumentCoaModel.bulkCreate(coaRows);
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "QA Document created successfully",
      qa_document_id: qaDocument.id
    });
  } catch (error) {
    console.error("STORE QA DOCUMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateQaDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, coaItems } = req.body;

    await QaDocumentModel.update({ company_id }, { where: { id } });

    // remove old coa rows
    await QaDocumentCoaModel.destroy({
      where: { qa_document_id: id },
      force: true
    });

    // insert new rows
    const rows = coaItems.map((item) => ({
      qa_document_id: id,
      ...item
    }));

    await QaDocumentCoaModel.bulkCreate(rows);

    res.json({
      success: true,
      message: "QA Document updated successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteQaDocument = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await QaDocumentCoaModel.destroy({
      where: { qa_document_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await QaDocumentModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "QA Document Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
