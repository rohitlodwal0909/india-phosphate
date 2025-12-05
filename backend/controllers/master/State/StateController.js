const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { State, User } = db;

// Create
exports.createState = async (req, res, next) => {
  try {
    const { state_name, code, created_by } = req.body;
    const newState = await State.create({
      state_name,
      code,
      created_by
    });

    const user_id = req.body.created_by || created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `State name '${state_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    // Create new staff entry
    res.status(201).json(newState);
  } catch (error) {
    next(error);
  }
};

exports.getStateById = async (req, res, next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States) {
      const error = new Error("State entry not found");
      error.status = 404;
      return next(error);
    }
    res.json(States);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllState = async (req, res, next) => {
  try {
    const States = await State.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(States);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateState = async (req, res, next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States) {
      const error = new Error("State entry not found");
      error.status = 404;
      return next(error);
    }
    const { state_name, code, created_by } = req.body;
    const user_id = req.body.created_by || States?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `State name '${state_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await States.update({
      state_name,
      code,
      created_by
    });
    res.json(State);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deleteState = async (req, res, next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States) {
      const error = new Error("State entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req.body.user_id || States?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `State name '${States?.state_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await States.destroy();
    res.json({ message: "State entry deleted" });
  } catch (error) {
    next(error);
  }
};
