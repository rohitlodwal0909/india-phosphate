const { where } = require("sequelize");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { Equipment, User } = db;

// Create
exports.create = async (req, res, next) => {
  try {
    const user_id = req.admin?.id || null;

    const equipment = await Equipment.create({
      ...req.body,
      created_by: user_id
    });

    const username = req.admin?.username || "Unknown User";
    const { entry_date, entry_time } = getISTDateTime();

    await createLogEntry({
      user_id,
      message: `Equipment '${equipment.name}' was created by '${username}' on ${entry_date} at ${entry_time}.`
    });

    return res.status(201).json({
      message: "Equipment created successfully.",
      data: equipment
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Get All Equipment
// =======================
exports.findAll = async (req, res, next) => {
  try {
    const data = await Equipment.findAll({
      where: {
        deleted_at: null
      }
    });

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get Single Equipment
// =======================
exports.findOne = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      const error = new Error("Equipment not found.");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: "Equipment fetched successfully.",
      data: equipment
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Update Equipment
// =======================
exports.update = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      const error = new Error("Equipment not found.");
      error.status = 404;
      return next(error);
    }

    await equipment.update(req.body);

    const user_id = req.admin?.id || null;
    const username = req.admin?.username || "Unknown User";
    const { entry_date, entry_time } = getISTDateTime();

    await createLogEntry({
      user_id,
      message: `Equipment '${equipment.name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`
    });

    return res.status(200).json({
      message: "Equipment updated successfully.",
      data: equipment
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Delete Equipment
// =======================
exports.delete = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      const error = new Error("Equipment not found.");
      error.status = 404;
      return next(error);
    }

    const user_id = req.admin?.id || null;
    const username = req.admin?.username || "Unknown User";
    const { entry_date, entry_time } = getISTDateTime();

    await createLogEntry({
      user_id,
      message: `Equipment '${equipment.name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`
    });

    await equipment.destroy();

    return res.status(200).json({
      message: "Equipment deleted successfully."
    });
  } catch (err) {
    next(err);
  }
};
