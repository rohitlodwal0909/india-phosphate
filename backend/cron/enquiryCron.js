const cron = require("node-cron");
const { enquiryFollowups } = require("../helper/enquiryFollowups");

const enquiryCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running Enquiry Job...");
    await enquiryFollowups();
  });
};

module.exports = enquiryCron;
