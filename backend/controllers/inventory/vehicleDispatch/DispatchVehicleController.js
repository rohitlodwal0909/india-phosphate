const db = require("../../../models");
const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const { DispatchVehicle, DispatchBatch, Qcbatch, Transport } = db;
const { sequelize } = db;

exports.dispatchvehicleEntry = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { entry_date, entry_time } = getISTDateTime();

    const user_id = req.admin.id;
    const username = req.admin.username;

    const { batches = [], ...vehicleData } = req.body;

    /* ================= CREATE VEHICLE ENTRY ================= */
    const newEntry = await DispatchVehicle.create(
      {
        ...vehicleData,
        dispatch_date: entry_date,
        user_id
      },
      { transaction }
    );

    /* ================= SAVE MULTIPLE BATCHES ================= */
    if (Array.isArray(batches) && batches.length) {
      const batchPayload = batches.map((b) => ({
        dispatch_id: newEntry.id,
        batch_id: b.batch_no,
        quantity: b.quantity,
        unit: b.unit
      }));

      await DispatchBatch.bulkCreate(batchPayload, {
        transaction
      });
    }

    /* ================= LOG ================= */
    const logMessage = `Dispatch entry for vehicle number '${newEntry.vehicle_number}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id, message: logMessage }, transaction);

    await transaction.commit();

    return res.status(201).json({
      message: "Dispatch Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.getAllDispatchVehicles = async (req, res, next) => {
  try {
    const entries = await DispatchVehicle.findAll({
      include: [
        {
          model: DispatchBatch,
          as: "batches",
          include: [
            {
              model: Qcbatch,
              as: "batch"
            }
          ]
        },
        {
          model: Transport
        }
      ]
    });
    res.status(200).json({ data: entries });
  } catch (error) {
    next(error);
  }
};

exports.updateDispatchVehicle = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const id = req.params.id;

    const entry = await DispatchVehicle.findByPk(id, { transaction });

    if (!entry) {
      const error = new Error("Dispatch Entry not found");
      error.status = 404;
      throw error;
    }

    const { entry_date, entry_time } = getISTDateTime();

    const user_id = req.admin.id;
    const username = req.admin.username;

    const { batches = [], ...vehicleData } = req.body;

    /* ================= UPDATE VEHICLE ================= */

    await entry.update(
      {
        ...vehicleData
      },
      { transaction }
    );

    /* ================= DELETE OLD BATCHES ================= */

    await DispatchBatch.destroy({
      where: { dispatch_id: id },
      transaction
    });

    /* ================= INSERT NEW BATCHES ================= */

    if (Array.isArray(batches) && batches.length) {
      const batchPayload = batches.map((b) => ({
        dispatch_id: id,
        batch_id: b.batch_no,
        quantity: b.quantity,
        unit: b.unit
      }));

      await DispatchBatch.bulkCreate(batchPayload, {
        transaction
      });
    }

    /* ================= LOG ================= */

    const logMessage = `Dispatch entry for vehicle number '${entry.vehicle_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry(
      {
        user_id,
        message: logMessage
      },
      transaction
    );

    /* ================= COMMIT ================= */

    await transaction.commit();

    return res.status(200).json({
      message: "Dispatch Entry updated successfully",
      data: entry
    });
  } catch (error) {
    await transaction.rollback();
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
