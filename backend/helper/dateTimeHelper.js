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

exports.getFinancialYearFromDate = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = d.getMonth() + 1; // JS month 0-based hota hai

  let startYear;

  if (month >= 4) {
    // April ya uske baad
    startYear = year;
  } else {
    // Jan, Feb, Mar
    startYear = year - 1;
  }

  const nextYearShort = (startYear + 1).toString().slice(-2);

  return `${startYear}-${nextYearShort}`;
};
