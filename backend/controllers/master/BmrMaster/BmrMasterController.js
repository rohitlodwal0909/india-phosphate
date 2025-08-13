const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { BmrMaster ,User} = db;

// Create
exports.create = async (req, res ,next) => {
  try {
    const data = await BmrMaster.create(req.body);
     const user_id = req.body.created_by;
    const bmr_code = req.body.bmr_code;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `BMR code '${bmr_code}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
       await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(data);
  } catch (err) {
    next(err)
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await BmrMaster.findAll();
    res.status(200).json(data);
  } catch (err) {
     next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await BmrMaster.findByPk(req.params.id);
    if (!data){ 
       const error = new Error( "Bmr not found" );
       error.status = 404;
      return next(error); 
    }
    res.status(200).json(data);
  } catch (err) {
    next(err)
  }
};

exports.update = async (req, res,next ) => {
  try {

    const updated = await BmrMaster.update(req.body, {
      where: { id: req.params.id }
    });
     const user_id = req.body.created_by || updated?.created_by;
    const bmr_code = req.body.bmr_code;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `BMR code '${bmr_code}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(200).json({ message: "Bmr  updated successfully" });
  } catch (err) {   
  next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
     const bmr = await BmrMaster.findByPk(req.params.id);
    if (!bmr) {
      return res.status(404).json({ message: "BMR not found" });
    }

    // Extract info before deletion
    const user_id = req.body.user_id ||bmr.created_by;
    const bmr_code = bmr.bmr_code;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `BMR code '${bmr_code}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });
    await BmrMaster.destroy({ where: { id: req.params.id } });
     
    res.status(200).json({ message: "Bmr deleted successfully" });
   } catch (err) {
      next(err)
  }
};