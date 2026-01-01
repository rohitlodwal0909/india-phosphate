const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

exports.getISTDateTime = () => {
  const now = dayjs().tz("Asia/Kolkata");

  return {
    entry_date: now.format("YYYY-MM-DD"),
    entry_time: now.format("HH:mm:ss")
  };
};
