const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { GuardEntry, User, GrnEntry } = db;
exports.store = async (req, res, next) => {
  const {
    user_id,
    name,
    guard_type,
    product_name,
    product_id,
    quantity_net,
    quantity_unit,
    sender_name,
    vehicle_number,
    remark
  } = req.body;

  // Generate current date and time
  const now = new Date();
  const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

  try {
    // Find the latest inward_number to increment
    const latestEntry = await GuardEntry.findOne({
      order: [["created_at", "DESC"]]
    });

    let nextNumber = 1;

    if (latestEntry && latestEntry.inward_number) {
      const lastNum = parseInt(latestEntry.inward_number.replace("INW-", ""));
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }
    const inward_number = `INW-${nextNumber.toString().padStart(4, "0")}`;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const logMessage = `Guard entry '${inward_number}' was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    const newEntry = await GuardEntry.create({
      user_id,
      name,
      guard_type,
      product_name,
      product_id,
      quantity_net,
      quantity_unit,
      sender_name,
      vehicle_number,
      inward_number,
      entry_date,
      entry_time,
      remark
    });

    await createNotificationByRoleId({
      title: "New Guard Store",
      message:
        "Store verification required for the newly submitted guard entry ",
      role_id: 2
    });

    res.status(201).json({
      message: "Guard Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    next(error);
  }
};

exports.guardEntry = async (req, res, next) => {
  try {
    const entries = await GuardEntry.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: GrnEntry,
          as: "grn_entries", // Must match the association alias
          required: false
        }
      ]
    });

    res.status(200).json({
      message: "All Guard Entries fetched successfully",
      data: entries
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteGuardEntry = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const entry = await GuardEntry.findByPk(id);
    if (!entry) {
      const error = new Error("Guard Entry not found");
      error.status = 400;
      return next(error);
    }
    const { inward_number } = entry;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const logMessage = `Guard entry '${inward_number}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    await entry.destroy();

    res.status(200).json({ message: "Guard Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update Guard Entry
exports.updateGuardEntry = async (req, res, next) => {
  const { id } = req.params;
  const {
    user_id,
    name,
    inward_number,
    vehicle_number,
    quantity_net,
    guard_type,
    product_name,
    product_id,
    sender_name,
    quantity_unit
  } = req.body;
  try {
    const entry = await GuardEntry.findByPk(id);
    if (!entry) {
      const error = new Error("Guard Entry not found");
      error.status = 400;
      return next(error);
    }

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    await entry.update({
      inward_number,
      vehicle_number,
      name,
      quantity_net,
      guard_type,
      product_name,
      product_id,
      sender_name,
      quantity_unit,
      entry_date,
      entry_time
    });
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Guard entry '${inward_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.status(200).json({
      message: "Guard Entry updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
