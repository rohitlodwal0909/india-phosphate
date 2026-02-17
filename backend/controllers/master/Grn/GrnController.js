const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");
const { GRNMaster } = db;

// Create
exports.create = async (req, res, next) => {
  try {
    const { financial_year, grn_no } = req.body;

    const newCategory = await GRNMaster.create({
      user_id: req.admin.id,
      financial_year,
      grn_no
    });

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Grn no.'${grn_no}' was created by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.findAll = async (req, res, next) => {
  try {
    const grn = await GRNMaster.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(grn);
  } catch (error) {
    next(error);
  }
};

// Update
exports.update = async (req, res, next) => {
  try {
    const grn = await GRNMaster.findByPk(req.params.id);
    if (!grn) {
      const error = new Error("Grn entry not found");
      error.status = 404;
      return next(error);
    }

    const { financial_year, grn_no } = req.body;

    await grn.update({
      financial_year,
      grn_no
    });

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Grn No. '${grn_no}' was updated by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });

    res.json(grn);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const grn = await GRNMaster.findByPk(req.params.id);
    if (!grn) {
      const error = new Error("grn entry not found");
      error.status = 404;
      return next(error);
    }
    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Grn no ${grn?.grn_no}  was deleted by ${req.admin.username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });
    await grn.destroy();
    res.json({ message: "Grn entry deleted" });
  } catch (error) {
    next(error);
  }
};
