const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const { convertUnit } = require("../../../helper/unitConverter");
const db = require("../../../models");
const { Op, where } = require("sequelize");
const {
  ProductionResult,
  Qcbatch,
  Finishing,
  RoleModel,
  User,
  PmCode,
  RmCode,
  Equipment
} = db;

// exports.ProductionaddResult = async (req, res, next) => {
//   try {
//     const {
//       rm_code = [],
//       quantity = [],
//       unit = [],
//       user_id,
//       batch_id,
//       ...rest
//     } = req.body;

//     // Validation: Check available stock across entries
//     for (let i = 0; i < rm_code.length; i++) {
//       const code = rm_code[i];
//       const reqQty = parseFloat(quantity[i] ?? 0);
//       const reqUnit = unit[i];

//       const grnEntries = await GrnEntry.findAll({
//         where: { store_rm_code: code },
//         order: [["id", "ASC"]]
//       });

//       if (!grnEntries.length) {
//         const error = new Error(`${code} is not available in the store.`);
//         error.status = 400;
//         return next(error);
//       }

//       let totalAvailable = 0;
//       let anyUnitMatched = false;

//       for (const entry of grnEntries) {
//         const containerQty = parseFloat(
//           entry.pending_quantity ?? entry.quantity ?? 0
//         );
//         const containerUnit = entry.unit;

//         try {
//           const converted = convertUnit(containerQty, containerUnit, reqUnit);
//           totalAvailable += converted;
//           anyUnitMatched = true;
//         } catch (err) {
//           continue; // Try other entries
//         }
//       }

//       if (!anyUnitMatched) {
//         const error = new Error(
//           `Unit mismatch for ${code}. No matching  unit found in store.`
//         );
//         error.status = 400;
//         return next(error);
//       }

//       if (totalAvailable < reqQty) {
//         const error = new Error(
//           `Insufficient quantity for ${code}. Available: ${totalAvailable} ${reqUnit}, required: ${reqQty}.`
//         );
//         error.status = 400;
//         return next(error);
//       }
//     }

//     // Create production entry
//     const newEntry = await ProductionResult.create(req.body);

//     // Deduction logic
//     for (let i = 0; i < rm_code.length; i++) {
//       const code = rm_code[i];
//       let remainingQty = parseFloat(quantity[i] ?? 0);
//       const reqUnit = unit[i];

//       const grnEntries = await GrnEntry.findAll({
//         where: { store_rm_code: code },
//         order: [["id", "ASC"]]
//       });

//       for (const entry of grnEntries) {
//         if (remainingQty <= 0) break;

//         const containerQty = parseFloat(
//           entry.pending_quantity ?? entry.quantity ?? 0
//         );
//         const containerUnit = entry.unit;

//         let availableInReqUnit;
//         try {
//           availableInReqUnit = convertUnit(
//             containerQty,
//             containerUnit,
//             reqUnit
//           );
//         } catch (err) {
//           continue; // skip this entry if unit mismatch
//         }

//         if (availableInReqUnit <= 0) continue;

//         const usedQty = Math.min(availableInReqUnit, remainingQty);
//         const usedInContainerUnit = convertUnit(
//           usedQty,
//           reqUnit,
//           containerUnit
//         );
//         const newPending = containerQty - usedInContainerUnit;

//         await entry.update({
//           pending_quantity: newPending,
//           production_status: "ISSUE"
//         });

//         remainingQty -= usedQty;
//       }
//     }
//     const data = await Qcbatch.findByPk(batch_id);

//     const user = await User.findByPk(user_id);
//     const username = user ? user.username : "Unknown User";
//     const now = new Date();
//     const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
//     const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
//     const logMessage = `Production entry for  Batch Number ${data?.qc_batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;
//     await createLogEntry({
//       user_id,
//       message: logMessage
//     });
//     const productionRole = await RoleModel.findOne({
//       where: { name: { [Op.like]: "%Production%" } }
//     });
//     const storeRole = await RoleModel.findOne({
//       where: { name: { [Op.like]: "%Inventory Manager%" } }
//     });

//     if (productionRole) {
//       await createNotificationByRoleId({
//         title: "New Production",
//         message: "Production has been successfully created.",
//         role_id: productionRole.id
//       });
//     }

//     if (storeRole) {
//       await createNotificationByRoleId({
//         title: "Store Request",
//         message: "Store request has been successfully submitted by production.",
//         role_id: storeRole.id
//       });
//     }

//     await createNotificationByRoleId({
//       title: "Finishing Request",
//       message:
//         "A request has been submitted by the production team with RM code details.",
//       role_id: 7
//     });

//     return res.status(201).json({
//       message: "Production Entry created successfully",
//       data: newEntry
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Production entry for Batch Number ${data?.qc_batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;

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
      order: [["created_at", "DESC"]] // optional: newest first
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
              required: false
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]] // optional: newest first
    });

    res.status(200).json({
      message: "Production results fetched successfully.",
      data: data
    });
  } catch (error) {
    next(error);
  }
};

exports.createFinishingEntry = async (req, res, next) => {
  try {
    const { finish_quantity, unfinish_quantity, batch_number, user_id } =
      req.body;

    if (!finish_quantity || !unfinish_quantity || !batch_number) {
      const error = new Error("All fields are required.");
      error.status = 400;
      return next(error);
    }
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const logMessage = `finish entry  ${batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    const newEntry = await Finishing.create({
      finish_quantity,
      unfinish_quantity,
      batch_number,
      user_id
    });

    await createNotificationByRoleId({
      title: "Dispatch Request",
      message:
        "Finishing team has completed . Batch number is now ready for dispatch.",
      role_id: 8
    });

    return res.status(201).json({
      message: "Finishing entry created successfully.",
      data: newEntry
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFinishingEntry = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await Finishing.findOne({
      where: { batch_number: id }
    });

    if (!existing) {
      const error = new Error("Finishing entry not found.");
      error.status = 404;
      return next(error);
    }
    const user_id = req?.body?.user || existing?.user_id;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const logMessage = `finish entry  ${existing?.finishing} was updated by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await existing.update(req.body);

    res.status(200).json({
      message: "Finishing entry updated successfully.",
      data: existing
    });
  } catch (error) {
    next(error);
  }
};
