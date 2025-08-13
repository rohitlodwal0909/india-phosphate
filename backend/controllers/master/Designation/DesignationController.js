const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Designation ,User} = db;

// Create
exports.createDesignation = async (req, res,next) => {
  try {
    const { designation_name, status, created_by} = req.body;
    const newDesignation = await Designation.create({
      designation_name,
      status,
      created_by:req.body?.created_by
    });
      const user_id = req.body.created_by || created_by;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Designation name '${designation_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(newDesignation);
  } catch (error) {
   next(error)
  }
};

exports.getDesignationById = async (req, res,next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations){
       const error = new Error( "Designation entry not found" );
       error.status = 404;
      return next(error)
    
}
    res.json(Designations);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllDesignation = async (req, res,next) => {
  try {
    const Designations = await Designation.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(Designations);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateDesignation = async (req, res,next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations) {
      const error = new Error( "Designation entry not found" );
       error.status = 404;
      return next(error)
    }

    const { designation_name, status, created_by  } = req.body;

    await Designations.update({
      designation_name,
      status,
      created_by
    });
     const user_id = req.body.created_by || Designations?.created_by;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Designation name '${designation_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.json(Designations);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteDesignation = async (req, res, next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations){ 
       const error = new Error( "Designation entry not found" );
       error.status = 404;
       return next(error)}
        const user_id = req.body.user_id || Designations?.created_by;
      const designation_name =  Designations?.designation_name;
      const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = ` Designation name '${designation_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await Designations.destroy();
    res.json({ message: "Designation entry deleted" });
  } catch (error) {
   next(error)
  }
};