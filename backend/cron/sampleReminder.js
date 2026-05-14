const cron = require("node-cron");
const { sampleReminderHelper } = require("../helper/sampleReminderHelper");

const sampleReminder = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running Sample Reminder Job...");
    await sampleReminderHelper();
  });
};

module.exports = sampleReminder;
