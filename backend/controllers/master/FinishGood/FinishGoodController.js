const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { FinishGood ,User} = db;

// Create
exports.createFinishGood = async (req, res,next) => {
   try {
    const {
      product_code,
      product_name,
      product_description,
      batch_size,
      unit_of_measure,
      packing_details,
      hsn_code,
      gst_rate,
      shelf_life,
      storage_condition,
      mrp,
      created_by
    } = req.body;

    const newFinishGood = await FinishGood.create({
      product_code,
      product_name,
      product_description,
      batch_size,
      unit_of_measure,
      packing_details,
      hsn_code,
      gst_rate,
      shelf_life,
      storage_condition,
      mrp,
      created_by,
      created_at: new Date(),
    });
      const user_id =  created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
const logMessage = `Finish Good with product name '${product_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    return res.status(201).json({
      success: true,
      message: 'Finish good created successfully',
      data: newFinishGood,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFinishGoodById = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findByPk(req.params.id);
    if (!FinishGoods){
       const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(FinishGoods);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllFinishGood = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(FinishGoods);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateFinishGood = async (req, res,next) => {
  try {
    const { id } = req.params;
    // Check if record exists
    const existingFinishGood = await FinishGood.findByPk(id);

    if (!existingFinishGood) {
      const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)
    }

    // Update record
       const user_id =  existingFinishGood?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Finish Good with product name '${existingFinishGood?.product_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await existingFinishGood.update({
      ...req.body
    });

    res.json({
      message: "Finish Good updated successfully.",
      existingFinishGood
    });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteFinishGood = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findByPk(req.params.id);
    if (!FinishGoods){   const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)}
          const user_id =  FinishGoods?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Finish Good with product name '${FinishGoods?.product_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
     await FinishGoods.destroy();
    res.json({ message: "Finish Good entry deleted" });
  } catch (error) {
    next(error)
  }
};