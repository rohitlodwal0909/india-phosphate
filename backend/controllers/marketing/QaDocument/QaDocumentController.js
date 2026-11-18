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
    let { company_id, priority, coaItems } = req.body;

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
      priority: priority || null,
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

        approval_from: row.approval_from || "marketing",

        comment: row.comment,

        admin_remark: row.admin_remark || null,

        file: req.files?.find((file) => file.fieldname === `file_${index}`)?.filename || null
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

    const roleId = Number(req.admin.role_id);
    const userId = Number(req.admin.id);
    const isAdmin = roleId === 1;
    const isQa = roleId === 3;
    const isMarketing = roleId === 9;

    if (!req.admin?.id) {
      return res.status(403).json({ success: false, message: "You cannot edit QA documents." });
    }

    let { company_id, priority, coaItems } = req.body;
    coaItems = typeof coaItems === "string" ? JSON.parse(coaItems) : coaItems || [];
    if (!Array.isArray(coaItems)) {
      return res.status(400).json({ success: false, message: "Invalid QA document rows." });
    }

    const parent = await QaDocumentModel.findByPk(id);
    if (!parent) {
      return res.status(404).json({ success: false, message: "QA document not found." });
    }

    const existingRows = await QaDocumentCoaModel.findAll({ where: { qa_document_id: id } });
    const existingById = new Map(existingRows.map((row) => [String(row.id), row]));
    const uploadedFiles = req.files || [];
    const fileForRow = (index) => uploadedFiles.find((file) => file.fieldname === `file_${index}`)?.filename;

    if (isAdmin || isMarketing) {
      await parent.update({
        company_id: company_id ?? parent.company_id,
        priority: priority ?? parent.priority
      });
    }

    const submittedIds = new Set();
    for (let index = 0; index < coaItems.length; index += 1) {
      const item = coaItems[index];
      const existing = existingById.get(String(item.id));
      const uploadedFile = fileForRow(index);
      const stepOneFields = {
        doc_name: item.doc_name || null,
        qa_person_id: item.qa_person_id || null,
        share_customer_by: item.share_customer_by || null,
        file: uploadedFile || item.old_file || null
      };

      if (existing) {
        submittedIds.add(String(existing.id));
        if (isAdmin) {
          await existing.update({
            ...stepOneFields,
            received_marketing_id: item.received_marketing_id || null,
            status: item.status || null,
            approval_from: item.approval_from === "admin" ? "admin" : "marketing",
            comment: item.comment || null,
            admin_remark: item.approval_from === "admin" ? item.admin_remark || null : null
          });
        } else {
          const updates = { ...stepOneFields };
          if (isQa && Number(existing.qa_person_id) === userId) {
            updates.status = item.status || null;
            updates.comment = item.comment || null;
            updates.admin_remark = item.approval_from === "admin" ? item.admin_remark || null : null;
            updates.approval_from = item.approval_from === "admin" ? "admin" : "marketing";
            updates.received_marketing_id = item.received_marketing_id || null;
          }
          await existing.update(updates);
        }
      } else {
        await QaDocumentCoaModel.create({
          qa_document_id: id,
          ...stepOneFields,
          received_marketing_id: isAdmin ? item.received_marketing_id || null : null,
          status: isAdmin ? item.status || null : null,
          approval_from: isAdmin && item.approval_from === "admin" ? "admin" : "marketing",
          comment: isAdmin ? item.comment || null : null,
          admin_remark: isAdmin && item.approval_from === "admin" ? item.admin_remark || null : null
        });
      }
    }

    const omittedIds = existingRows.filter((row) => !submittedIds.has(String(row.id))).map((row) => row.id);
    if (omittedIds.length) {
      await QaDocumentCoaModel.destroy({ where: { id: omittedIds }, force: true });
    }

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
