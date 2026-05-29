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

    return res.status(200).json(data);
  } catch (error) {
    console.error("GET QA DOCUMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.storeQaDocument = async (req, res) => {
  try {
    let { company_id, coaItems } = req.body;

    /* =========================================================
        PARSE COA ITEMS
    ========================================================= */

    coaItems =
      typeof coaItems === "string" ? JSON.parse(coaItems) : coaItems || [];

    /* =========================================================
        DATE TIME
    ========================================================= */

    const { entry_date, entry_time } = getISTDateTime();

    /* =========================================================
        CREATE QA DOCUMENT
    ========================================================= */

    const qaDocument = await QaDocumentModel.create({
      user_id: req.admin.id,
      company_id,
      date: entry_date
    });

    /* =========================================================
        PREPARE COA ITEMS
    ========================================================= */

    let coaRows = [];

    if (coaItems.length > 0) {
      coaRows = coaItems.map((row, index) => ({
        qa_document_id: qaDocument.id,

        doc_name: row.doc_name,

        qa_person_id: row.qa_person_id,

        received_marketing_id: row.received_marketing_id,

        share_customer_by: row.share_customer_by,

        status: row.status,

        comment: row.comment,

        file: req.files?.[index]?.filename || null
      }));

      /* =========================================================
          SAVE COA ITEMS
      ========================================================= */

      await QaDocumentCoaModel.bulkCreate(coaRows);

      /* =========================================================
          NOTIFICATIONS
      ========================================================= */

      const notificationsData = coaItems.map((row) => ({
        user_id: row.qa_person_id,

        title: "New QA Document Assigned",

        message: `QA Document "${row.doc_name}" has been assigned to you.`,

        is_read: 0,

        date_time: `${entry_date} ${entry_time}`
      }));

      await Notification.bulkCreate(notificationsData);
    }

    /* =========================================================
        RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,

      message: "QA Document Created Successfully ✅",

      qa_document_id: qaDocument.id
    });
  } catch (error) {
    console.error("STORE QA DOCUMENT ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Something went wrong"
    });
  }
};

exports.updateQaDocument = async (req, res) => {
  try {
    const { id } = req.params;

    let { company_id, coaItems } = req.body;

    // FORM DATA STRING TO JSON
    coaItems = JSON.parse(coaItems);

    // UPDATE MAIN TABLE
    await QaDocumentModel.update({ company_id }, { where: { id } });

    // UPLOADED FILES
    const uploadedFiles = req.files || [];

    // REMOVE OLD ROWS
    await QaDocumentCoaModel.destroy({
      where: { qa_document_id: id },
      force: true
    });

    // PREPARE ROWS
    const rows = coaItems.map((item, index) => ({
      qa_document_id: id,

      doc_name: item.doc_name || null,

      qa_person_id: item.qa_person_id || null,

      received_marketing_id: item.received_marketing_id || null,

      share_customer_by: item.share_customer_by || null,

      status: item.status || null,

      comment: item.comment || null,

      // PDF FILE
      file: uploadedFiles[index]
        ? uploadedFiles[index].filename
        : item.old_file || null
    }));

    // INSERT NEW ROWS
    await QaDocumentCoaModel.bulkCreate(rows);

    return res.status(200).json({
      success: true,
      message: "QA Document updated successfully"
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
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
