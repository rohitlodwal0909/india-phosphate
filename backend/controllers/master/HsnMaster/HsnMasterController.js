const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { HSN ,User } = db;

// Create
exports.create = async (req, res, next) => {
  try {
    // Step 1: Generate unique hsn_code
    const lastHSN = await HSN.findOne({
      order: [["created_at", "DESC"]],
    });

    let nextHsnCode = "HSN-0001"; // default
    if (lastHSN && lastHSN.hsn_code) {
      const lastNumber = parseInt(lastHSN.hsn_code.split("-")[1]);
      const newNumber = (lastNumber + 1).toString().padStart(4, "0");
      nextHsnCode = `HSN-${newNumber}`;
    }

    // Step 2: Create new HSN entry with auto hsn_code
    req.body.hsn_code = nextHsnCode;
    const data = await HSN.create(req.body);

    // Step 3: Send response first (non-blocking log)
    res.status(201).json(data);

    // Step 4: Logging
    const user_id = data?.created_by || req.body?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `HSN code '${nextHsnCode}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id, message: logMessage });
    
  } catch (err) {
    console.error("Create HSN Error:", err);
    next(err);
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