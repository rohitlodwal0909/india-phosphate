const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { HSN ,User } = db;

// Create
exports.create = async (req, res,next) => {
  try {
    const data = await HSN.create(req.body);
    res.status(201).json(data);
       const user_id =  data?.created_by || req.body?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `HSN code '${data?.hsn_code}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
        
  } catch (err) {
    next(err)
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await HSN.findAll();
     const resultWithUsernames = await Promise.all(
      data.map(async (make) => {
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
  } catch (err) {
    next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await HSN.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "HSN not found" });
    res.status(200).json(data);
  } catch (err) {
    next(err)
  }
};

exports.update = async (req, res,next) => {
  try {
    const updated = await HSN.update(req.body, {
      where: { id: req.params.id }
    });

      const user_id =  req.body?.created_by  || updated?.created_by ;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `HSN code '${updated?.hsn_code}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
        
    res.status(200).json({ message: "HSN updated successfully" });
  } catch (err) {
    next(err)
  }
};
exports.delete = async (req, res, next) => {
  try {
    // Step 1: Get the HSN entry before deletion
    const hsn = await HSN.findByPk(req.params.id);
    if (!hsn) {
      return res.status(404).json({ message: "HSN not found" });
    }

    // Step 2: Get user details
    const user_id = hsn.created_by || req.body?.user_id;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 3: Log creation
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `HSN code '${hsn.hsn_code}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });

    // Step 4: Delete the HSN entry
    await HSN.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: "HSN deleted successfully" });
  } catch (err) {
    next(err);
  }
};