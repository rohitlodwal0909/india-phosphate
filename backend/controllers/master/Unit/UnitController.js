const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Unit ,User} = db;

// Create
exports.createUnit = async (req, res,next) => {
  try {
    const { unit, user_id } = req.body;
 
    const newUnit = await Unit.create({
      unit,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Unit name '${unit}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json(newUnit);
  } catch (error) {
   next(error)
  }
};

exports.getUnitById = async (req, res,next) => {
  try {
    const units = await Unit.findByPk(req.params.id);
    if (!units )
     {const error = new Error("Unit entry not found");
       error.status = 404;
      return next(error)
     }

    res.json(units );
  } catch (error) {
    next(error)
  }
};

// Read By ID
exports.getAllUnit = async (req, res,next) => {
  try {
    const units  = await Unit.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(units );
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateUnit = async (req, res,next) => {
  try {
    const units  = await Unit.findByPk(req.params.id);
    if (!units ) {
      const error = new Error("Unit entry not found");
       error.status = 404;
      return next(error)

    }

    const { unit , user_id  } = req.body;

    await units.update({
      unit ,
    });


    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Unit name '${unit}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json(Unit);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteUnit = async (req, res,next) => {
  try {
    const units = await Unit.findByPk(req.params.id);
    if (!units ){const error = new Error("Unit entry not found");
       error.status = 404;
      return next(error)}
      const user_id = req.body?.user_id ||units?.user_id;
       const now = new Date();
      const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
      const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Unit name ${units?.unit}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });
    await units.destroy();
    res.json({ message: "Unit entry deleted" });
  } catch (error) {
   next(error)
  }
};