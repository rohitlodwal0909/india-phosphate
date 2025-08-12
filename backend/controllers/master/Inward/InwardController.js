const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Inward ,User} = db;
const moment = require('moment');
// Create
exports.createInward = async (req, res,next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const countToday = await Inward.count({
      where: {
        inward_date: today
      }
    });

    const serial = String(countToday + 1).padStart(3, "0");

    const inwardNumber = `INW-${moment().format("YYYYMMDD")}-${serial}`;

    const inward = await Inward.create({
      inward_number: inwardNumber,
      inward_date: today,
      vendor_id: req.body.vendor_id,
      item_id: req.body.item_id,
      quantity: req.body.quantity,
      uom: req.body.uom,
      vehicle_number: req.body.vehicle_number,
      created_by: req.body.created_by,
      remarks: req.body.remarks
    });

    
      const user_id = req.body.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Inward number '${inwardNumber}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
        
    res.status(201).json(inward);
  } catch (err) {
    next(err);
  }
};

exports.getInwardById = async (req, res,next) => {
  try {
    const Inwards = await Inward.findByPk(req.params.id);
    if (!Inwards){
       const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(Inwards);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllInward = async (req, res,next) => {
  try {
    const Inwards = await Inward.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(Inwards);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateInward = async (req, res,next) => {
  try {
    const id = req.params.id;
    const inward = await Inward.findByPk(id);

    if (!inward) {
       const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)
    }

    // Update allowed fields only
     const user_id =inward?.created_by || req.body.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Inward number '${inward?.inward_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await inward.update({
      vendor_id: req.body.vendor_id || inward.vendor_id,
      item_id: req.body.item_id || inward.item_id,
      quantity: req.body.quantity || inward.quantity,
      uom: req.body.uom || inward.uom,
      vehicle_number: req.body.vehicle_number || inward.vehicle_number,
      remarks: req.body.remarks || inward.remarks,
      
    });

    res.json({
      message: "Inward updated successfully.",
      inward
    });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteInward = async (req, res,next) => {
  try {
    const Inwards = await Inward.findByPk(req.params.id);
    if (!Inwards){   const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)}

          // Update allowed fields only
     const user_id =Inwards?.created_by || req.body.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Inward number '${Inwards?.inward_number}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await Inwards.destroy();
    res.json({ message: "Inward entry deleted" });
  } catch (error) {
    next(error)
  }
};