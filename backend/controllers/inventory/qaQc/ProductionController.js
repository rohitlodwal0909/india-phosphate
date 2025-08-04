const { createLogEntry } = require("../../../helper/createLogEntry");
const {  createNotificationByRoleId } = require("../../../helper/SendNotification");
const { convertUnit} = require("../../../helper/unitConverter");
const db = require("../../../models");
const { Op } = require("sequelize");
const {  ProductionResult ,Qcbatch,GrnEntry,Finishing,RoleModel,User} = db;

// exports.ProductionaddResult = async (req, res) => {
//   try {
//     const { rm_code = [], quantity = [], ...rest } = req.body;

//     // Step 1: Validate available quantities
//     for (let i = 0; i < rm_code.length; i++) {
//       const code = rm_code[i];
//       const reqQty = quantity[i] ?? 0;

//       const grnEntries = await GrnEntry.findAll({
//         where: { store_rm_code: code },
//         order: [['id', 'ASC']], // optional: FIFO logic
//       });

//       if (!grnEntries || grnEntries.length === 0) {
//         return res.status(400).json({
//           message: `${code} is not available in the store.`,
//         });
//       }

//       const totalAvailable = grnEntries.reduce((sum, entry) => {
//         const qty = entry.pending_quantity !== null ? entry.pending_quantity : entry.quantity;
//         return sum + Number(qty || 0);
//       }, 0);

//       if (totalAvailable < reqQty) {
//         return res.status(400).json({
//           message: `Store has only ${totalAvailable} quantity for ${code}, but ${reqQty} units were requested.`,
//         });
//       }
//     }

//     // Step 2: Create Production Entry
//     const newEntry = await ProductionResult.create(req.body);

//     // Step 3: Deduct quantities from all matching GRN entries in FIFO
//     for (let i = 0; i < rm_code.length; i++) {
//       const code = rm_code[i];
//       let remainingQty = quantity[i] ?? 0;

//       const grnEntries = await GrnEntry.findAll({
//         where: { store_rm_code: code },
//         order: [['id', 'ASC']], // FIFO
//       });

//       for (const entry of grnEntries) {
//         if (remainingQty <= 0) break;

//         const availableQty = entry.pending_quantity !== null
//           ? entry.pending_quantity
//           : entry.quantity;

//         if (availableQty <= 0) continue;

//         const usedQty = Math.min(availableQty, remainingQty);
//         const newPendingQty = availableQty - usedQty;

//         await entry.update({
//           production_status: "ISSUE",
//           pending_quantity: newPendingQty,
//         });

//         remainingQty -= usedQty;
//       }
//     }

//     // Step 4: Notifications
//     const productionRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Production%" } } });
//     const storeRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Inventory Manager%" } } });

//     if (productionRole) {
//       await createNotificationByRoleId({
//         title: "New Production",
//         message: `Production has been successfully created.`,
//         role_id: productionRole.id,
//       });
//     }

//     if (storeRole) {
//       await createNotificationByRoleId({
//         title: "Store Request",
//         message: `Store request has been successfully submitted by production.`,
//         role_id: storeRole.id,
//       });
//     }

//     await createNotificationByRoleId({
//       title: "Finishing Request",
//       message: "A request has been submitted by the production team with RM code details.",
//       role_id: 7,
//     });

//     return res.status(201).json({
//       message: "Production Entry created successfully",
//       data: newEntry,
//     });
//   } catch (error) {
//     console.error("Error in ProductionaddResult:", error);
//     return res.status(500).json({ message: "Server Error", error });
//   }
// };


exports.ProductionaddResult = async (req, res ,next) => {
  try {
    const { rm_code = [], quantity = [], unit = [], user_id , batch_id, ...rest } = req.body;

    // Validation: Check available stock across entries
    for (let i = 0; i < rm_code.length; i++) {
      const code = rm_code[i];
      const reqQty = parseFloat(quantity[i] ?? 0);
      const reqUnit = unit[i];

      const grnEntries = await GrnEntry.findAll({
        where: { store_rm_code: code },
        order: [['id', 'ASC']],
      });

      if (!grnEntries.length) {
         const error = new Error(`${code} is not available in the store.`)
        error.status = 400;
        return next(error);
      }

      let totalAvailable = 0;
      let anyUnitMatched = false;

      for (const entry of grnEntries) {
        const containerQty = parseFloat(entry.pending_quantity ?? entry.quantity ?? 0);
        const containerUnit = entry.unit;

        try {
          const converted = convertUnit(containerQty, containerUnit, reqUnit);
          totalAvailable += converted;
          anyUnitMatched = true;
        } catch (err) {
          continue; // Try other entries
        }

      }

      if (!anyUnitMatched) {
        const error = new Error(`Unit mismatch for ${code}. No matching  unit found in store.`)
        error.status = 400;
        return next(error);
      }

      if (totalAvailable < reqQty) {
         const error = new Error(`Insufficient quantity for ${code}. Available: ${totalAvailable} ${reqUnit}, required: ${reqQty}.`);
       error.status = 400;
        return next(error);
      }
    }

    // Create production entry
    const newEntry = await ProductionResult.create(req.body);

    // Deduction logic
    for (let i = 0; i < rm_code.length; i++) {
      const code = rm_code[i];
      let remainingQty = parseFloat(quantity[i] ?? 0);
      const reqUnit = unit[i];

      const grnEntries = await GrnEntry.findAll({
        where: { store_rm_code: code },
        order: [['id', 'ASC']],
      });

      for (const entry of grnEntries) {
        if (remainingQty <= 0) break;

        const containerQty = parseFloat(entry.pending_quantity ?? entry.quantity ?? 0);
        const containerUnit = entry.unit;

        let availableInReqUnit;
        try {
          availableInReqUnit = convertUnit(containerQty, containerUnit, reqUnit);
        } catch (err) {
          continue; // skip this entry if unit mismatch
        }

        if (availableInReqUnit <= 0) continue;

        const usedQty = Math.min(availableInReqUnit, remainingQty);
        const usedInContainerUnit = convertUnit(usedQty, reqUnit, containerUnit);
        const newPending = containerQty - usedInContainerUnit;
      
        await entry.update({
          pending_quantity: newPending,
          production_status: "ISSUE",
        });

        remainingQty -= usedQty;
      }
    }
    const data = await Qcbatch.findByPk(batch_id)

      const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
        const now = new Date();
        const entry_date = now.toISOString().split("T")[0];        // yyyy-mm-dd
        const entry_time = now.toTimeString().split(" ")[0];       // HH:mm:ss
       const logMessage = `Production entry for  Batch Number ${data?.qc_batch_number} was created by ${username} on ${entry_date} at ${entry_time}.`;
            await createLogEntry({
                  user_id,
                  message: logMessage,
                });
    const productionRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Production%" } } });
    const storeRole = await RoleModel.findOne({ where: { name: { [Op.like]: "%Inventory Manager%" } } });

    if (productionRole) {
      await createNotificationByRoleId({
        title: "New Production",
        message: "Production has been successfully created.",
        role_id: productionRole.id,
      });
    }

    if (storeRole) {
      await createNotificationByRoleId({
        title: "Store Request",
        message: "Store request has been successfully submitted by production.",
        role_id: storeRole.id,
      });
    }

    await createNotificationByRoleId({
      title: "Finishing Request",
      message: "A request has been submitted by the production team with RM code details.",
      role_id: 7,
    });

    return res.status(201).json({
      message: "Production Entry created successfully",
      data: newEntry,
    });
  } catch (error) {
   next(error)
  }
};


exports.getQcbatchesWithProduction = async (req, res,next) => {
  try {
    const data = await Qcbatch.findAll({
      include: [
        {
          model: ProductionResult,
          as: 'production_results', // must match your model alias
        },
      ],
      order: [['created_at', 'DESC']], // optional: newest first
    });

    res.status(200).json(data);
  } catch (error) {
   next(error)
  }
};

exports.getAllProductionResults = async (req, res,next) => {
  try {
    const results = await ProductionResult.findAll({
      include: [
        {
          model: Finishing,
          as: 'finishing_entries', // match alias from association
          required: false // true if you want only those with finishing data
        }
      ],
     order: [['created_at', 'DESC']]
    });
    res.status(200).json({
      message: "Production results fetched successfully.",
      data: results
    });
  } catch (error) {
   next(error)
  }
};

exports.createFinishingEntry = async (req, res,next) => {
  try {
    const {
      finishing,
      unfinishing,
      finish_quantity,
      unfinish_quantity,
      batch_number
    } = req.body;

    if (
      !finishing ||
      !unfinishing ||
      !finish_quantity ||
      !unfinish_quantity ||
      !batch_number
    ) {
       const error = new Error("All fields are required." );
       error.status = 400;
      return next(error); 
      
    }

    const newEntry = await Finishing.create({
      finishing,
      unfinishing,
      finish_quantity,
      unfinish_quantity,
      batch_number
    });

  await createNotificationByRoleId({
  title: "Dispatch Request",
  message: "Finishing team has completed . Batch number is now ready for dispatch.",
  role_id: 8
});

    return res.status(201).json({
      message: "Finishing entry created successfully.",
      data: newEntry
    });
  } catch (error) {
   next(error)
  }
}

exports.updateFinishingEntry = async (req, res,next) => {
  const { id } = req.params;

  try {
    const existing = await Finishing.findOne({
      where: { batch_number :id }
    });

    if (!existing) {
       const error = new Error( "Finishing entry not found.");
       error.status = 404;
      return next(error); 
    
    }

    await existing.update(req.body);

    res.status(200).json({
      message: "Finishing entry updated successfully.",
      data: existing
    });
  } catch (error) {
    next(error)
  }
};



