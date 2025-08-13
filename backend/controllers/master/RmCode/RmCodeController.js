const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { RmCode ,RawMaterial, User} = db;

// Create
exports.createRmCode = async (req, res ,next) => {
  try {
    const { name, rm_code, user_id } = req.body;
    const newRmCode = await RmCode.create({
      name,
      rm_code,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Rm Code '${rm_code}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json(newRmCode);
  } catch (error) {
    next(error)
  }
};

exports.getRmCodeById = async (req, res,next) => {
  try {
    const rmCode = await RmCode.findByPk(req.params.id);
    if (!rmCode)
    {const error = new Error( "Rm Code entry not found" );
       error.status = 404;
      return next(error)}

    res.json(rmCode);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllRmCode = async (req, res,next) => {
  try {
    const rmcode = await RmCode.findAll({
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(rmcode);
  } catch (error) {
    next(error)
  }
};


// Update
exports.updateRmCode = async (req, res,next) => {
  try {
    const rmCode = await RmCode.findByPk(req.params.id);
    if (!rmCode) {
const error = new Error( "Rm Code entry not found" );
       error.status = 404;
      return next(error)
    }
    const { name, rm_code ,user_id} = req.body;

    await rmCode.update({
     name,
     rm_code
    });


    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Rm Code '${rm_code}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json(RmCode);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteRmCode = async (req, res,next) => {
  try {
    const rmcodes = await RmCode.findByPk(req.params.id);
    if (!rmcodes){
      const error = new Error( "Rm Code entry not found" );
       error.status = 404;
      return next(error)
    }
      const user_id = req.body?.user_id || rmcodes?.user_id;
       const now = new Date();
      const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
      const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Rm Code  ${rmcodes?.rm_code}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });
    await rmcodes.destroy();
    res.json({ message: "Rm Code entry deleted" });
  } catch (error) {
   next(error)
  }
};



exports.createRawMaterial = async (req, res,next) => {
  try {
    const { rm_code, fields } = req.body;

    if (!rm_code || !Array.isArray(fields) || fields.length === 0) {
       const error = new Error( "rm_code and fields are required.");
       error.status = 400;
      return next(error)
       
    }

    const createdMaterials = [];

    for (const field of fields) {
      const { type, test, limit } = field;

      if (!type || !test || !limit) {
        const error = new Error( "Each field must include type, test, and limit."  );
       error.status = 400;
      return next(error)
       
      }

      const newMaterial = await RawMaterial.create({
        rm_code,
        type,
        test,
        limit
        // result field is still intentionally excluded
      });

      createdMaterials.push(newMaterial);
    }

    return res.status(201).json({
      message: "Raw materials created successfully.",
      data: createdMaterials
    });

  } catch (error) {
  next(error)
  }
};