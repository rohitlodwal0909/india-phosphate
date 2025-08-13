const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { MakeMaster, User} = db;

// Create
exports.createMakeMaster = async (req, res, next) => {
  try {
    const { make_code, make_name, description, status, created_by } = req.body;

    // Check if make_code or make_name already exists (optional)
    const existingMake = await MakeMaster.findOne({
      where: { make_code }
    });

    if (existingMake) {
      const error = new Error("A Make master with this code already exists.");
      error.status = 400;
      return next(error);
    }
        // Update allowed fields only
     const user_id = created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Make code '${make_code}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    // Create new MakeMaster entry
    const newMakeMaster = await MakeMaster.create({
      make_code,
      make_name,
      description,
      status,
      created_by
    });

    res.status(201).json(newMakeMaster);
  } catch (error) {
    console.error("Create MakeMaster Error:", error);
    next(error);
  }
};

exports.getMakeMasterById = async (req, res,next) => {
  try {
    const MakeMasters = await MakeMaster.findByPk(req.params.id);
    if (!MakeMasters){
       const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(MakeMasters);
  } catch (error) {
  next(error)
  }
};

        // Read By ID
       exports.getAllMakeMaster = async (req, res, next) => {
  try {
    const makeList = await MakeMaster.findAll({
      where: {
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });

    const resultWithUsernames = await Promise.all(
      makeList.map(async (make) => {
        const user = await User.findOne({
          where: { id: make.created_by },
          attributes: ['username']
        });

        return {
          ...make.toJSON(),
          created_by_username: user?.username || null
        };
      })
    );

    res.status(200).json(resultWithUsernames);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateMakeMaster = async (req, res, next) => {
  try {
    const makeMasterId = req.params.id;
    const existingMakeMaster = await MakeMaster.findByPk(makeMasterId);

    if (!existingMakeMaster) {
      const error = new Error("Make master entry not found");
      error.status = 404;
      return next(error);
    }

    const { make_code, make_name, description, status, created_by } = req.body;
     const user_id = created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Make code '${make_code}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await existingMakeMaster.update({
      make_code,
      make_name,
      description,
      status,
      created_by
    });

    res.status(200).json({
      message: "Make master updated successfully",
      data: existingMakeMaster
    });
  } catch (error) {
    console.error("Update MakeMaster Error:", error);
    next(error);
  }
};


// Delete
exports.deleteMakeMaster = async (req, res,next) => {
  try {
    const MakeMasters = await MakeMaster.findByPk(req.params.id);

    if (!MakeMasters){ const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
       const user_id =  req?.body?.user_id || MakeMasters?.created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Make code '${MakeMasters?.make_code}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
      
    await MakeMasters.destroy();
    res.json({ message: "Make master entry deleted" });
  } catch (error) {
   next(error)
  }
};