const db = require("../models");
const { PurchaseOrderModel } = db;
const { getISTDateTime } = require("../helper/dateTimeHelper");
const { Op } = require("sequelize");
const { createNotificationByRoleId } = require("./SendNotification");

const accountPaymentReminder = async () => {
  try {
    const { entry_date } = getISTDateTime();

    /* ----------------------------------
       Find Pending Payments
    ---------------------------------- */
    const reminders = await PurchaseOrderModel.findAll({
      where: {
        payment_status: "Pending",
        expected_delivery_date: {
          [Op.lte]: entry_date // ✅ due or overdue
        }
      },
      attributes: ["id", "po_no"],
      raw: true
    });

    if (!reminders.length) return;

    /* ----------------------------------
       Create Single Summary Notification
    ---------------------------------- */
    const poList = reminders.map((r) => r.po_no).join(", ");

    const title = "⚠️ Payment Reminder";

    const message = `Payment pending for ${reminders.length} Purchase Orders: ${poList}`;

    await createNotificationByRoleId({
      title,
      message,
      role_id: 10, // Accounts Role
      module_id: 5,
      submodule_id: 3
    });

    console.log(`✅ Payment reminder sent for ${reminders.length} POs`);
  } catch (error) {
    console.error("❌ Error in accountPaymentReminder:", error);
  }
};

module.exports = { accountPaymentReminder };
