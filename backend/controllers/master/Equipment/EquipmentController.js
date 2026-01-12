const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Equipment, User } = db;

// Create
exports.create = async (req, res) => {
  try {
    const data = await Equipment.create(req.body);
    const user_id = req.body.created_by || data?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Equipment name '${req.body?.name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const data = await Equipment.findAll();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const data = await Equipment.findByPk(req.params.id);
    if (!data) {
      const error = new Error("Equipment  not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Equipment.update(req.body, {
      where: { id: req.params.id }
    });
    const user_id = req.body.created_by || updated?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Equipment name '${updated?.name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const hsn = await Equipment.findByPk(req.params.id);
    if (!hsn) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    const user_id = req.body.user_id || hsn?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Equipment name '${hsn?.name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await Equipment.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    next(err);
  }
};
