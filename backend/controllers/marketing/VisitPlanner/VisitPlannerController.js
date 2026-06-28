const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { aiCustomerSummary } = require("../../../helper/openAi");

const { VisitPlannerModel, VisitPlannerDetail, User, Notification, Customer } =
  db;

exports.getVisitPlanner = async (req, res) => {
  try {
    const data = await VisitPlannerModel.findAll({
      order: [["id", "DESC"]],

      include: [
        {
          model: VisitPlannerDetail,
          as: "visits",
          required: false,
          include: [
            {
              model: Customer,
              as: "customer",
              required: false
            },
            {
              model: User,
              as: "sales_person",
              required: false
            }
          ]
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

exports.getMeetingSummary = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await aiCustomerSummary(id);

    return res.status(200).json(data);
  } catch (error) {
    console.error("GET  ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.storeVisitPlanner = async (req, res) => {
  try {
    let { ai_preparation_brief, customer_visits } = req.body;

    /* =========================================================
        PARSE JSON
    ========================================================= */

    customer_visits =
      typeof customer_visits === "string"
        ? JSON.parse(customer_visits)
        : customer_visits || [];

    /* =========================================================
        DATE TIME
    ========================================================= */

    const { entry_date, entry_time } = getISTDateTime();

    /* =========================================================
        CREATE MAIN PLANNER
    ========================================================= */

    const planner = await VisitPlannerModel.create({
      user_id: req.admin.id,
      ai_preparation_brief,
      date: entry_date,
      total_visits: customer_visits?.length
    });

    /* =========================================================
        MAP FILES TO VISITS
    ========================================================= */

    const visits = customer_visits.map((row, index) => ({
      visit_planner_id: planner.id,

      customer_id: row.customer_id,
      customer_name: row.customer_name,

      sales_person_id: row.sales_person_id,
      sales_person_name: row.sales_person_name,

      address: row.address,

      latitude: row.latitude,
      longitude: row.longitude,

      visit_order: row.visit_order,

      visit_date: row.visit_date,
      visit_time: row.visit_time,

      priority: row.priority,

      meeting_purpose: row.meeting_purpose,
      agenda: row.agenda,
      discussion_notes: row.discussion_notes,
      productivity: row.productivity,
      next_action: row.next_action,

      followup_date: row.followup_date,

      status: row.status,

      file: req.files?.[index]?.filename || null,

      created_at: entry_date
    }));

    /* =========================================================
        SAVE CHILD RECORDS
    ========================================================= */

    await VisitPlannerDetail.bulkCreate(visits);

    /* =========================================================
        RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,
      message: "Visit Planner Created Successfully ✅",
      planner_id: planner.id
    });
  } catch (error) {
    console.log("STORE VISIT PLANNER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};

exports.updateVisitPlanner = async (req, res) => {
  try {
    const { id } = req.params;

    let { customer_visits, ai_preparation_brief, fileIndexes } = req.body;

    /* =====================================================
       PARSE JSON
    ===================================================== */

    customer_visits =
      typeof customer_visits === "string"
        ? JSON.parse(customer_visits)
        : customer_visits || [];

    /* =====================================================
       FILE INDEXES ARRAY
    ===================================================== */

    fileIndexes = fileIndexes
      ? Array.isArray(fileIndexes)
        ? fileIndexes
        : [fileIndexes]
      : [];

    /* =====================================================
       UPDATE MAIN
    ===================================================== */

    await VisitPlannerModel.update(
      {
        ai_preparation_brief,
        total_visits: customer_visits.length,
        updated_at: new Date()
      },
      {
        where: { id }
      }
    );

    /* =====================================================
       OLD ROWS
    ===================================================== */

    const oldRows = await VisitPlannerDetail.findAll({
      where: {
        visit_planner_id: id
      }
    });

    const oldIds = oldRows.map((x) => x.id);

    const incomingIds = customer_visits
      .filter((x) => x.id)
      .map((x) => Number(x.id));

    /* =====================================================
       DELETE REMOVED ROWS ONLY
    ===================================================== */

    const deleteIds = oldIds.filter((oldId) => !incomingIds.includes(oldId));

    if (deleteIds.length > 0) {
      await VisitPlannerDetail.destroy({
        where: {
          id: deleteIds
        }
      });
    }

    /* =====================================================
       UPDATE / CREATE ROWS
    ===================================================== */

    for (let index = 0; index < customer_visits.length; index++) {
      const item = customer_visits[index];

      /* =========================================
         FIND FILE FOR THIS ROW
      ========================================= */

      let uploadedFile = null;

      const filePosition = fileIndexes.findIndex((x) => Number(x) === index);

      if (filePosition !== -1) {
        uploadedFile = req.files?.[filePosition]?.filename;
      }

      /* =========================================
         PAYLOAD
      ========================================= */

      const payload = {
        visit_planner_id: id,

        sales_person_id: item.sales_person_id,
        customer_id: item.customer_id,

        customer_name: item.customer_name,

        address: item.address,

        latitude: item.latitude,
        longitude: item.longitude,

        visit_order: item.visit_order || index + 1,

        visit_date: item.visit_date,

        priority: item.priority,

        meeting_purpose: item.meeting_purpose,

        agenda: item.agenda,

        discussion_notes: item.discussion_notes,

        productivity: item.productivity,

        next_action: item.next_action,

        followup_date: item.followup_date,

        status: item.status,

        file: uploadedFile || (typeof item.file === "string" ? item.file : null)
      };

      /* =========================================
         UPDATE EXISTING
      ========================================= */

      if (item.id) {
        await VisitPlannerDetail.update(payload, {
          where: {
            id: item.id
          }
        });
      } else {
        /* =========================================
         CREATE NEW
      ========================================= */
        await VisitPlannerDetail.create(payload);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Visit Planner Updated Successfully"
    });
  } catch (error) {
    console.error("UPDATE VISIT PLANNER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteVisitPlanner = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await VisitPlannerDetail.destroy({
      where: { visit_planner_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await VisitPlannerModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Visit Planner Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
