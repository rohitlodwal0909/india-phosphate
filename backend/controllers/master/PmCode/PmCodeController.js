const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { PmCode, PmRawMaterial, User } = db;

// Create
exports.createPmCode = async (req, res, next) => {
  try {
    const { name, pm_code, user_id } = req.body;
    const newPmCode = await PmCode.create({
      name,
      pm_code,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Pm Code '${pm_code}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.status(201).json(newPmCode);
  } catch (error) {
    next(error);
  }
};

exports.getPmCodeById = async (req, res, next) => {
  try {
    const pmCode = await PmCode.findByPk(req.params.id);
    if (!pmCode) {
      const error = new Error("Rm Code entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(pmCode);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllPmCode = async (req, res, next) => {
  try {
    const pmcode = await PmCode.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(pmcode);
  } catch (error) {
    next(error);
  }
};

exports.getPmRawMaterial = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pmRawMaterial = await PmRawMaterial.findAll({ id });

    res.status(200).json(pmRawMaterial);
  } catch (error) {
    next(error);
  }
};
// Update
exports.updatePmCode = async (req, res, next) => {
  try {
    const pmCode = await PmCode.findByPk(req.params.id);
    if (!pmCode) {
      const error = new Error("Rm Code entry not found");
      error.status = 404;
      return next(error);
    }
    const { name, pm_code, user_id } = req.body;

    await pmCode.update({
      name,
      pm_code
    });

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Pm Code '${pm_code}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.json(PmCode);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deletePmCode = async (req, res, next) => {
  try {
    const pmcodes = await PmCode.findByPk(req.params.id);
    if (!pmcodes) {
      const error = new Error("Rm Code entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req.body?.user_id || pmcodes?.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Rm Code  ${pmcodes?.pm_code}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });
    await pmcodes.destroy();
    res.json({ message: "Rm Code entry deleted" });
  } catch (error) {
    next(error);
  }
};

exports.createRawMaterial = async (req, res, next) => {
  try {
    const { pm_id, fields } = req.body;

    if (!pm_id || !Array.isArray(fields) || fields.length === 0) {
      const error = new Error("pm_code and fields are required.");
      error.status = 400;
      return next(error);
    }

    const createdMaterials = [];

    for (const field of fields) {
      const { type, test, limit } = field;

      if (!type || !test || !limit) {
        const error = new Error(
          "Each field must include type, test, and limit."
        );
        error.status = 400;
        return next(error);
      }

      const newMaterial = await PmRawMaterial.create({
        pm_id,
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
    next(error);
  }
};
