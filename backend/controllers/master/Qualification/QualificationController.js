const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Qualification ,User} = db;

// Create
exports.createQualification = async (req, res ,next) => {
  try {
    const { qualification_name, status,created_by } = req.body;
    const newQualification = await Qualification.create({
      qualification_name,
      status,
      created_by
    });

  
    const user_id = req.body.created_by || created_by;
      const user = await User.findByPk(user_id);
      const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Qualification name '${qualification_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(newQualification);
  } catch (error) {
    next(error)
  }
};

exports.getQualificationById = async (req, res,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications)
    {
      const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)
    }

    res.json(Qualifications);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllQualification = async (req, res ,next) => {
  try {
    const Qualifications = await Qualification.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(Qualifications);
  } catch (error) {
    next(error)
  }
};


// Update
exports.updateQualification = async (req, res,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications) {
    const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)
    }

    const { qualification_name, status ,created_by } = req.body;

    await Qualifications.update({
      qualification_name,
      status,
      created_by
    });

 const user_id = req.body.created_by || Qualifications?.created_by;
      const user = await User.findByPk(user_id);
      const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Qualification name '${qualification_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });

    res.json(Qualifications);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteQualification = async (req, res ,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications){   const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)}
       const user_id = req.body.user_id || Qualifications?.created_by;
      const user = await User.findByPk(user_id);
      const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Qualification name '${Qualifications?.qualification_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await Qualifications.destroy();
    res.json({ message: "Qualification entry deleted" });
  } catch (error) {
   next(error)
  }
};