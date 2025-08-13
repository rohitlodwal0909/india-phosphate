const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { CurrencyMaster,User } = db;

// Create
exports.create = async (req, res) => {
  try {
    const data = await CurrencyMaster.create(req.body);
    res.status(201).json(data);
    const user_id = req.body.created_by || data?.created_by;
    const currency_name = req.body.currency_name;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";


    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Currency name '${currency_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await CurrencyMaster.findAll();
    res.status(200).json(data);
  } catch (err) {
     next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await CurrencyMaster.findByPk(req.params.id);
    if (!data){ 
       const error = new Error( "Currency  not found" );
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
    const updated = await CurrencyMaster.update(req.body, {
      where: { id: req.params.id }
    });
    const user_id = req.body.created_by || updated?.created_by;
    const currency_name = req.body.currency_name || updated?.currency_name;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Currency name '${currency_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(200).json({ message: "Currency updated successfully" });
  } catch (err) {
  next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
     const hsn = await CurrencyMaster.findByPk(req.params.id);
    if (!hsn) {
      return res.status(404).json({ message: "Currency entry  not found" });
    }
     const user_id = req.body.user_id || hsn?.created_by;
    const currency_name =  hsn?.currency_name;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Currency name '${currency_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await CurrencyMaster.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Currency deleted successfully" });
   } catch (err) {
      next(err)
  }
};