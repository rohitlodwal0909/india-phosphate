const db = require("../models");
const { Log } = db;

exports.createLogEntry = async ({ user_id, message }) => {
  try {
    await Log.create({
      user_id,
      message
    });
    console.log("Log entry created.");
  } catch (error) {
    console.error("Error creating log entry:", error);
  }
};
