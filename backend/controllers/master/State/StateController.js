const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { State ,User} = db;

// Create
exports.createState = async (req, res,next) => {
  try {
    const { state_name } = req.body;
    const newState = await State.create({
      state_name,
    });
    res.status(201).json(newState);
  } catch (error) {
   next(error)
  }
};

exports.getStateById = async (req, res,next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States)
    { const error = new Error("State entry not found");
       error.status = 404;
      return next(error)}
    res.json(States);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllState = async (req, res,next) => {
  try {
    const States = await State.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(States);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateState = async (req, res,next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States) {
     const error = new Error("State entry not found");
       error.status = 404;
      return next(error)
    }
    const { state_name } = req.body;
    await States.update({
      state_name,
    });
    res.json(State);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteState = async (req, res,next) => {
  try {
    const States = await State.findByPk(req.params.id);
    if (!States)
       {const error = new Error("State entry not found");
       error.status = 404;
      return next(error)}
    
    await States.destroy();
    res.json({ message: "State entry deleted" });
  } catch (error) {
   next(error)
  }
};