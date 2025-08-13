const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { BatchMaster, User} = db;

// Create
exports.createBatchMaster = async (req, res, next) => {
  try {
    const {
      bmr_number,
      batch_number,
      product_name,
      production_date,
      expiry_date,
      quantity_produced,
      raw_materials_used,
      process_details,
      verified_by,
      approved_by,
      status,
     created_by
    } = req.body;

    // Optionally check for duplicate batch_number or bmr_number
    const existingBatch = await BatchMaster.findOne({
      where: { batch_number }
    });

    if (existingBatch) {
      const error = new Error("Batch number already exists.");
      error.status = 400;
      return next(error);
    }

    const newBatch = await BatchMaster.create({
      bmr_number,
      batch_number,
      product_name,
      production_date,
      expiry_date,
      quantity_produced,
      raw_materials_used, // JSON data like [{material_id: 1, qty: 10}]
      process_details,
      verified_by,
      approved_by,
      status,
created_by
    });

          const user_id  = newBatch?.created_by
         const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
         const now = new Date();
        const entry_date = now.toISOString().split("T")[0];
        const entry_time = now.toTimeString().split(" ")[0];
        const logMessage = `Batch number '${newBatch?.batch_number}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });

    res.status(201).json({
      message: "Batch master created successfully",
      data: newBatch
    });
  } catch (error) {
    console.error("Create BatchMaster Error:", error);
    next(error);
  }
};

exports.getBatchMasterById = async (req, res,next) => {
  try {
    const BatchMasters = await BatchMaster.findByPk(req.params.id);
    if (!BatchMasters){
       const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(BatchMasters);
  } catch (error) {
  next(error)
  }
};

        // Read By ID
       exports.getAllBatchMaster = async (req, res, next) => {
  try {
    const makeList = await BatchMaster.findAll({
      where: {
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(makeList);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateBatchMaster = async (req, res, next) => {
  try {
    const batchMasterId = req.params.id;
    const existingBatchMaster = await BatchMaster.findByPk(batchMasterId);

    if (!existingBatchMaster) {
      const error = new Error("Batch master entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      bmr_number,
      batch_number,
      product_name,
      production_date,
      expiry_date,
      quantity_produced,
      raw_materials_used, // assuming JSON object or stringified JSON
      process_details,
      verified_by,
      approved_by,
      status,
     created_by
    } = req.body;

     const user_id  = created_by || existingBatchMaster?.created_by 
         const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
         const now = new Date();
        const entry_date = now.toISOString().split("T")[0];
        const entry_time = now.toTimeString().split(" ")[0];
        const logMessage = `Batch number '${existingBatchMaster?.batch_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });

    await existingBatchMaster.update({
      bmr_number,
      batch_number,
      product_name,
      production_date,
      expiry_date,
      quantity_produced,
      raw_materials_used,
      process_details,
      verified_by,
      approved_by,
      status,
      created_by
    });

    res.status(200).json({
      message: "Batch master updated successfully",
      data: existingBatchMaster,
    });
  } catch (error) {
    console.error("Update BatchMaster Error:", error);
    next(error);
  }
};


// Delete
exports.deleteBatchMaster = async (req, res,next) => {
  try {
    const BatchMasters = await BatchMaster.findByPk(req.params.id);

    if (!BatchMasters){ const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
      
        const user_id  = req.body.user_id|| BatchMasters?.created_by 
         const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
         const now = new Date();
        const entry_date = now.toISOString().split("T")[0];
        const entry_time = now.toTimeString().split(" ")[0];
        const logMessage = `Batch number '${BatchMasters?.batch_number}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await BatchMasters.destroy();
    res.json({ message: "Make master entry deleted" });
  } catch (error) {
   next(error)
  }
};