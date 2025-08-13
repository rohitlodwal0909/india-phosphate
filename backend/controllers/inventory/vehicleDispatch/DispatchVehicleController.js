const db = require("../../../models");
const { createLogEntry } = require("../../../helper/createLogEntry");
const { DispatchVehicle ,User} = db;

exports.dispatchvehicleEntry = async (req, res , next) => {
  try {
    const now = new Date();
    const dispatch_date = now.toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS format
    const entryData = { ...req.body, dispatch_date };
    const newEntry = await DispatchVehicle.create(entryData);
    const  user_id = req.body.user_id 
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const logMessage = `Dispatch entry for vehicle number '${newEntry.vehicle_number}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });

    res.status(201).json({
      message: "Dispatch Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    next(error)
  }
};


exports.getAllDispatchVehicles = async (req, res,next) => {
  try {
    const entries = await DispatchVehicle.findAll();
    res.status(200).json({ data: entries });
  } catch (error) {
    next(error);
  }
};

exports.updateDispatchVehicle = async (req, res,next) => {
  try {
    const id = req.params.id;
     const entry = await DispatchVehicle.findByPk(id);
    if (!entry) {
       const error = new Error( "Dispatch Entry not found");
           error.status = 400;
        return next(error);
    } 

     const now = new Date();
    const  user_id = req.body.user_id || entry?.user_id
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const logMessage = `Dispatch entry for vehicle number '${entry.vehicle_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await DispatchVehicle.update(req.body, { where: { id } });
    res.status(200).json({ message: 'Dispatch Entry updated successfully' });
  } catch (error) {
    next(error)
  }
};

exports.deleteDispatchVehicle = async (req, res,next) => {
  try {
    const id = req.params.id;
 const entry = await DispatchVehicle.findByPk(id);
    if (!entry) {
       const error = new Error( "Dispatch Entry not found");
           error.status = 400;
        return next(error);
    } 
    const now = new Date();
     const user_id = entry?.user_id
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const logMessage = `Dispatch entry for vehicle number '${entry.vehicle_number}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });

    await DispatchVehicle.destroy({ where: { id } });
    res.status(200).json({ message: 'Dispatch Entry deleted successfully' });
  } catch (error) {
    next(error)
  }
};

