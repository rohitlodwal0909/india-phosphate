const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { Op } = require("sequelize");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { createZoomMeeting } = require("../../../helper/createZoomMeeting");
const { createGoogleMeet } = require("../../../helper/googleMeetHelper");

const {
  MeetingModel,
  MeetingInvitesModel,
  EnquiryIntrestedProductsModel,
  Customer,
  WorkOrderModel,
  User,
  Product,
  Notification
} = db;

exports.getMeeting = async (req, res) => {
  try {
    const userId = req.admin.id;
    const role = userId == "5" ? "admin" : "user";
    // req.admin.role;

    let whereCondition = {};

    /* ================= ADMIN ================= */
    if (role !== "admin") {
      // Normal User
      whereCondition = {
        [Op.or]: [
          { user_id: userId }, // creator
          { "$invites_meetings.user_id$": userId } // invited
        ]
      };
    }

    const data = await MeetingModel.findAll({
      where: whereCondition,

      order: [["id", "DESC"]],

      include: [
        {
          model: MeetingInvitesModel,
          as: "invites_meetings",
          required: false, // admin ko sab dikhana hai
          include: [
            {
              model: User,
              as: "users",
              required: false
            }
          ]
        }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error("GET MEETING ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

exports.storeMeeting = async (req, res) => {
  try {
    const {
      meeting_title,
      meeting_type,
      platform,
      date,
      time,
      description,
      internal_users,
      external_emails
    } = req.body;

    /* ================= VALIDATION ================= */

    const { entry_date, entry_time } = getISTDateTime();

    if (!meeting_title)
      return res.status(400).json({
        success: false,
        message: "Meeting title required"
      });

    if (!date || !time)
      return res.status(400).json({
        success: false,
        message: "Meeting date & time required"
      });

    /* ================= CREATE MEETING ================= */

    let meeting_link = null;

    if (req.body.platform === "Zoom") {
      const zoomMeeting = await createZoomMeeting(
        req.body.meeting_title,
        req.body.date,
        req.body.time
      );

      meeting_link = zoomMeeting.join_url;
    }

    if (platform === "Google Meet") {
      const meet = await createGoogleMeet(meeting_title, date, time);
      meeting_link = meet.join_url;
    }

    const meeting = await MeetingModel.create({
      user_id: req.admin.id,
      meeting_title,
      meeting_type,
      platform,
      date,
      time,
      meeting_link,
      description
    });

    /* ================= SAVE INTERNAL INVITES ================= */

    let inviteRows = [];

    if (internal_users && internal_users.length > 0) {
      internal_users.forEach((userId) => {
        inviteRows.push({
          meeting_id: meeting.id,
          user_id: userId,
          status: "pending"
        });
      });

      const notificationsData = internal_users.map((user_id) => ({
        user_id,
        title: "New Meeting Scheduled",
        message: `You have been invited to meeting: ${meeting.meeting_title}`,
        is_read: 0,
        date_time: `${entry_date} ${entry_time}`
      }));

      await Notification.bulkCreate(notificationsData);
    }

    /* ================= SAVE EXTERNAL EMAIL INVITES ================= */

    if (external_emails) {
      const emails = external_emails.split(",");

      emails.forEach((email) => {
        inviteRows.push({
          meeting_id: meeting.id,
          email: email.trim(),
          status: "pending"
        });
      });
    }

    if (inviteRows.length > 0) {
      await MeetingInvitesModel.bulkCreate(inviteRows);
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Meeting Scheduled Successfully",
      meeting_id: meeting.id
    });
  } catch (error) {
    console.error("STORE MEETING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= PARSE PRODUCTS ================= */

    let products = [];

    if (req.body.products) {
      products =
        typeof req.body.products === "string"
          ? JSON.parse(req.body.products)
          : req.body.products;
    }

    /* ================= UPDATE ENQUIRY ================= */

    await EnquiryModel.update(
      {
        company_id: req.body.company_id
      },
      { where: { id } }
    );

    /* ================= DELETE OLD PRODUCTS ================= */

    await EnquiryIntrestedProductsModel.destroy({
      where: { enquiry_id: id }
    });

    /* ================= ADD NEW PRODUCTS ================= */

    const productRows = products.map((p, index) => {
      return {
        enquiry_id: id,
        product_id: p.product_id,
        grade: p.grade,
        person_name: p.sales_person,
        followups: JSON.stringify(p.followups) || []
      };
    });

    if (productRows.length) {
      await EnquiryIntrestedProductsModel.bulkCreate(productRows);
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Enquiry Updated Successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Update failed"
    });
  }
};

exports.completeMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= FIND MEETING ================= */

    const meeting = await MeetingModel.findOne({
      where: { id }
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found ❌"
      });
    }

    /* ================= ALREADY COMPLETED CHECK ================= */

    if (meeting.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Meeting already completed ⚠️"
      });
    }

    /* ================= UPDATE STATUS ================= */

    await meeting.update({
      status: "Completed"
    });

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Meeting marked as completed ✅",
      data: meeting
    });
  } catch (error) {
    console.error("COMPLETE MEETING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Meeting completion failed"
    });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= DELETE CHILD RECORDS ================= */
    await EnquiryIntrestedProductsModel.destroy({
      where: { enquiry_id: id }
    });

    /* ================= DELETE MAIN ENQUIRY ================= */
    await EnquiryModel.destroy({
      where: { id }
    });

    res.json({
      success: true,
      message: "Enquiry Deleted Successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
