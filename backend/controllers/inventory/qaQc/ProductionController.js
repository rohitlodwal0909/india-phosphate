const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const {
  ProductionResult,
  Qcbatch,
  Finishing,
  User,
  PmCode,
  RmCode,
  Equipment,
  PMIssueModel,
  RMIssueModel,
  FinishQty
} = db;

const sequelize = db.sequelize;

exports.ProductionaddResult = async (req, res, next) => {
  try {
    const {
      batch_id,
      user_id,

      rm_code = [],
      rm_quantity = [],
      rm_unit = [],

      pm_code = [],
      pm_quantity = [],
      pm_unit = [],

      equipments = []
    } = req.body;

    const rowsToInsert = [];
    // max rows decide karo (RM ya Equipment ke basis par)
    const maxLength = Math.max(
      rm_code.length,
      pm_code.length,
      equipments.length
    );

    for (let i = 0; i < maxLength; i++) {
      rowsToInsert.push({
        batch_id,
        user_id,

        rm_code: rm_code[i] || null,
        rm_quantity: rm_quantity[i] || null,
        rm_unit: rm_unit[i] || null,

        pm_code: pm_code[i] || null,
        pm_quantity: pm_quantity[i] || null,
        pm_unit: pm_unit[i] || null,

        equipments: equipments[i] || null
      });
    }

    // 🔥 BULK INSERT
    const newEntries = await ProductionResult.bulkCreate(rowsToInsert);

    /* ================= LOG ================= */

    const data = await Qcbatch.findByPk(batch_id);
    const { entry_date, entry_time } = getISTDateTime();

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    await data.update({
      production_date: `${entry_date}`
    });

    const logMessage = `Production entry for Batch Number ${data?.qc_batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;

    const title = `Material Issue Request - Batch ${data?.qc_batch_number}`;
    const message = `Please issue the required Raw Materials (RM), Packing Materials (PM), and Equipment for production of Batch ${data?.qc_batch_number}.`;

    await createNotificationByRoleId({
      title: title,
      message: message,
      role_id: 2
    });

    await createLogEntry({
      user_id,
      message: logMessage
    });

    return res.status(201).json({
      message: "Production Entry created successfully",
      data: newEntries
    });
  } catch (error) {
    next(error);
  }
};

exports.ProductionUpdateResult = async (req, res, next) => {
  try {
    const {
      batch_id,

      rm_code = [],
      rm_quantity = [],
      rm_unit = [],

      pm_code = [],
      pm_quantity = [],
      pm_unit = [],

      equipments = []
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!batch_id) {
      return res.status(400).json({
        message: "Batch ID is required"
      });
    }

    /* ================= DELETE OLD RECORDS ================= */

    await ProductionResult.destroy({
      where: { batch_id }
    });

    /* ================= PREPARE NEW DATA ================= */

    const rowsToInsert = [];

    const maxLength = Math.max(
      rm_code.length,
      pm_code.length,
      equipments.length
    );

    for (let i = 0; i < maxLength; i++) {
      rowsToInsert.push({
        batch_id,
        user_id: req.admin.id,

        rm_code: rm_code[i] || null,
        rm_quantity: rm_quantity[i] || null,
        rm_unit: rm_unit[i] || null,

        pm_code: pm_code[i] || null,
        pm_quantity: pm_quantity[i] || null,
        pm_unit: pm_unit[i] || null,

        equipments: equipments[i] || null
      });
    }

    /* ================= BULK INSERT NEW ================= */

    const updatedEntries = await ProductionResult.bulkCreate(rowsToInsert);
    /* ================= LOG SECTION ================= */

    const data = await Qcbatch.findByPk(batch_id);
    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Production entry for Batch Number ${data?.qc_batch_number} was updated by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });

    return res.status(200).json({
      message: "Production Entry updated successfully",
      data: updatedEntries
    });
  } catch (error) {
    next(error);
  }
};

exports.getQcbatchesWithProduction = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      include: [
        {
          model: ProductionResult,
          as: "production_results",
          include: [
            {
              model: RmCode,
              as: "rmcodes"
            },
            {
              model: PmCode,
              as: "pmcodes"
            },
            {
              model: Equipment,
              as: "equipment"
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAllProductionResults = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      include: [
        {
          model: ProductionResult,
          as: "production_results",
          required: true,
          include: [
            {
              model: Finishing,
              as: "finishing_entries",
              required: false,
              include: [
                {
                  model: FinishQty,
                  required: false
                }
              ]
            },
            {
              model: RmCode,
              as: "rmcodes"
            }
          ]
        },
        {
          model: PMIssueModel,
          required: true
        },
        {
          model: RMIssueModel,
          required: true
        }
      ],
      order: [["created_at", "DESC"]]
    });

    // ✅ ADD TOTALS
    const formattedData = data.map((batch) => {
      const batchJSON = batch.toJSON();

      batchJSON.production_results = batchJSON.production_results.map(
        (prod) => {
          prod.finishing_entries =
            prod.finishing_entries?.map((finish) => {
              const total_finish = finish.FinishQties?.reduce(
                (sum, f) => sum + Number(f.finishing_qty || 0),
                0
              );

              const total_unfinish = Number(
                finish.FinishQties?.at(-1)?.unfinishing_qty || 0
              );

              return {
                ...finish,
                total_finishing_qty: total_finish,
                total_unfinishing_qty: total_unfinish
              };
            }) || [];

          return prod;
        }
      );

      return batchJSON;
    });

    res.status(200).json({
      message: "Production results fetched successfully.",
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

exports.createFinishingEntry = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { batch_number, finishing } = req.body;

    // Validation
    if (!batch_number || !finishing?.length) {
      const error = new Error("Batch number and finishing data are required.");
      error.status = 400;
      return next(error);
    }

    const { entry_date, entry_time } = getISTDateTime();

    const dateTime = `${entry_date} ${entry_time}`;

    // Main Entry
    const finishingEntry = await Finishing.create(
      {
        batch_number,
        user_id: req.admin.id
      },
      { transaction }
    );

    // Multiple Rows Insert
    const finishRecords = await Promise.all(
      finishing.map((f) =>
        FinishQty.create(
          {
            finish_id: finishingEntry.id,
            finishing_qty: Number(f.finish_quantity),
            unfinishing_qty: Number(f.unfinish_quantity),
            time: dateTime
          },
          { transaction }
        )
      )
    );

    // Log
    const logMessage = `Finish entry ${batch_number} was created by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry(
      {
        user_id: req.admin.id,
        message: logMessage
      },
      { transaction }
    );

    // Notification
    await createNotificationByRoleId(
      {
        title: "Dispatch Request",
        message: `Finishing team has completed batch ${batch_number}. Ready for dispatch.`,
        role_id: 8
      },
      { transaction }
    );

    // ✅ Commit all
    await transaction.commit();

    return res.status(201).json({
      message: "Finishing entry created successfully.",
      data: {
        finishingEntry,
        finishRecords
      }
    });
  } catch (error) {
    await transaction.rollback(); // 🔥 rollback safety
    next(error);
  }
};

exports.updateFinishingEntry = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { batch_number, finishing } = req.body;

    if (!batch_number || !finishing?.length) {
      const error = new Error("Batch number and finishing data are required.");
      error.status = 400;
      return next(error);
    }

    // FIND EXISTING
    const existing = await Finishing.findOne({
      where: { batch_number: id },
      include: [{ model: FinishQty, as: "FinishQties" }],
      transaction
    });

    if (!existing) {
      const error = new Error("Finishing entry not found.");
      error.status = 404;
      return next(error);
    }

    // UPDATE MAIN ENTRY
    await existing.update(
      {
        batch_number,
        user_id: req.admin.id
      },
      { transaction }
    );

    // EXISTING IDS
    const existingIds = existing.FinishQties?.map((f) => f.id) || [];

    const incomingIds = finishing.filter((f) => f.id).map((f) => f.id);

    // DELETE REMOVED ROWS
    const deleteIds = existingIds.filter((id) => !incomingIds.includes(id));

    if (deleteIds.length) {
      await FinishQty.destroy({
        where: { id: deleteIds },
        transaction
      });
    }

    // CURRENT TIME
    const { entry_date, entry_time } = getISTDateTime();
    const dateTime = `${entry_date} ${entry_time}`;

    // INSERT / UPDATE LOOP
    for (const f of finishing) {
      if (f.id) {
        // UPDATE
        await FinishQty.update(
          {
            finishing_qty: Number(f.finish_quantity),
            unfinishing_qty: Number(f.unfinish_quantity)
          },
          {
            where: { id: f.id },
            transaction
          }
        );
      } else {
        // CREATE NEW ROW
        await FinishQty.create(
          {
            finish_id: existing.id,
            finishing_qty: Number(f.finish_quantity),
            unfinishing_qty: Number(f.unfinish_quantity),
            time: dateTime
          },
          { transaction }
        );
      }
    }

    // LOG ENTRY
    const logMessage = `Finish entry ${batch_number} was updated by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry(
      {
        user_id: req.admin.id,
        message: logMessage
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Finishing entry updated successfully."
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
