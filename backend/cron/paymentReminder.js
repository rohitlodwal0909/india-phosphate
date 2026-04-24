const cron = require("node-cron");
const { accountPaymentReminder } = require("../helper/paymentReminder");

const startPaymentReminder = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running Payment Reminder Job...");
    await accountPaymentReminder();
  });
};

module.exports = startPaymentReminder;
