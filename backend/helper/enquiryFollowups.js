const db = require("../models");
const {
  EnquiryModel,
  Notification,
  EnquiryIntrestedProductsModel,
  Product,
  User,
  Customer
} = db;

const { getISTDateTime } = require("../helper/dateTimeHelper");

const enquiryFollowups = async () => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    /* ----------------------------------
       Get Enquiries
    ---------------------------------- */

    const enquiries = await EnquiryModel.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: EnquiryIntrestedProductsModel,
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
              as: "sales_name",
              attributes: ["id", "username"]
            }
          ]
        },
        {
          model: Customer,
          as: "customers",
          attributes: ["company_name"]
        }
      ]
    });

    if (!enquiries.length) return;

    /* ----------------------------------
       FILTER FOLLOWUPS
    ---------------------------------- */

    const today = new Date(entry_date);

    const notificationsMap = {};

    enquiries.forEach((enquiry) => {
      enquiry.interested_products.forEach((product) => {
        let followups = [];

        if (typeof product.followups === "string") {
          followups = JSON.parse(product.followups);
        } else {
          followups = product.followups || [];
        }

        followups.forEach((f) => {
          if (!f.followup_date) return;

          const followupDate = new Date(f.followup_date);

          if (followupDate <= today) {
            const userId = product.sales_name?.id;

            if (!userId) return;

            if (!notificationsMap[userId]) {
              notificationsMap[userId] = [];
            }

            notificationsMap[userId].push(
              `${enquiry.customers?.company_name} - ${product.product?.product_name} (${f.followup_date})`
            );
          }
        });
      });
    });

    const uniqueUserIds = Object.keys(notificationsMap);

    if (!uniqueUserIds.length) return;

    /* ----------------------------------
       CREATE USER-WISE NOTIFICATIONS
    ---------------------------------- */

    const notificationsData = uniqueUserIds.map((user_id) => ({
      user_id,
      title: "📞 Followup Reminder",
      message: notificationsMap[user_id].join("\n"),
      is_read: 0,
      date_time: `${entry_date} ${entry_time}`
    }));

    /* ----------------------------------
       BULK INSERT
    ---------------------------------- */

    await Notification.bulkCreate(notificationsData);

    console.log(`✅ Followup reminders sent (${notificationsData.length})`);
  } catch (error) {
    console.error("❌ enquiryFollowups Error:", error);
  }
};

module.exports = { enquiryFollowups };
