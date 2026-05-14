const db = require("../models");
const { SampleRequestModel } = db;
const { Op } = require("sequelize");
const { createNotificationByRoleId } = require("./SendNotification");

const sampleReminderHelper = async () => {
  try {
    /* ----------------------------------
       Find QC Pending Samples
    ---------------------------------- */

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const reminders = await SampleRequestModel.findAll({
      where: {
        qc_status: null, // ✅ Pending QC
        created_at: {
          [Op.lte]: twoDaysAgo
        }
      },
      attributes: ["id", "sr_no"],
      raw: true
    });

    if (!reminders.length) return;

    /* ----------------------------------
       Create Notification
    ---------------------------------- */

    const sampleList = reminders.map((r) => r.sr_no).join(", ");

    const title = "⏰ Sample Pending for QC";

    const message = `QC action pending for ${reminders.length} Samples: ${sampleList}`;

    await createNotificationByRoleId({
      title,
      message,
      role_id: 3,
      module_id: 4,
      submodule_id: 7
    });

    console.log(`✅ Sample reminder sent for ${reminders.length} samples`);
  } catch (error) {
    console.error("❌ Error in sampleReminder:", error);
  }
};

module.exports = { sampleReminderHelper };
