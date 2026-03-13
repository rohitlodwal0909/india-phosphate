const db = require("../../../models");
const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { DispatchVehicle, User } = db;

exports.dispatchvehicleEntry = async (req, res, next) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();
    const user_id = req.admin.id;
    const username = req.admin.username;

    const dispatch_date = entry_date;
    const entryData = { ...req.body, dispatch_date, user_id };
    const newEntry = await DispatchVehicle.create(entryData);

    const logMessage = `Dispatch entry for vehicle number '${newEntry.vehicle_number}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });

    res.status(201).json({
      message: "Dispatch Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllDispatchVehicles = async (req, res, next) => {
  try {
    const entries = await DispatchVehicle.findAll();
    res.status(200).json({ data: entries });
  } catch (error) {
    next(error);
  }
};

exports.updateDispatchVehicle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const entry = await DispatchVehicle.findByPk(id);
    if (!entry) {
      const error = new Error("Dispatch Entry not found");
      error.status = 400;
      return next(error);
    }

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Dispatch entry for vehicle number '${entry.vehicle_number}' was updated by '${req.admin.username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: req.admin.id, message: logMessage });
    await DispatchVehicle.update(req.body, { where: { id } });
    res.status(200).json({ message: "Dispatch Entry updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteDispatchVehicle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const entry = await DispatchVehicle.findByPk(id);
    if (!entry) {
      const error = new Error("Dispatch Entry not found");
      error.status = 400;
      return next(error);
    }
    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Dispatch entry for vehicle number '${entry.vehicle_number}' was deleted by '${req.admin.username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: req.admin.id, message: logMessage });

    await DispatchVehicle.destroy({ where: { id } });
    res.status(200).json({ message: "Dispatch Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
