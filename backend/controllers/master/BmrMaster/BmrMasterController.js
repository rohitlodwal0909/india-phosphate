const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { BmrMaster ,User} = db;

// Create
exports.create = async (req, res, next) => {
  try {
    // Step 1: Get latest BMR record to generate next code
    const lastBmr = await BmrMaster.findOne({
      order: [["created_at", "DESC"]],
    });

    let nextBmrCode = "BMR-0001"; // default for first record
    if (lastBmr && lastBmr.bmr_code) {
      const lastNumber = parseInt(lastBmr.bmr_code.split("-")[1]);
      const newNumber = (lastNumber + 1).toString().padStart(4, "0");
      nextBmrCode = `BMR-${newNumber}`;
    }

    // Step 2: Assign the generated bmr_code to req.body
    req.body.bmr_code = nextBmrCode;

    // Step 3: Create new BMR entry
    const data = await BmrMaster.create(req.body);

    // Step 4: Logging
    const user_id = req.body.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `BMR code '${nextBmrCode}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });

    res.status(201).json(data);
  } catch (err) {
    console.error("Create BMR Error:", err);
    next(err);
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