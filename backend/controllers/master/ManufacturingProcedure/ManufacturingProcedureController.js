const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { ManufacturingProcedure } = db;

// Create Department
exports.createProcedure = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newDepartment = await ManufacturingProcedure.create({
      name,
      user_id: req.admin.id
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Create Department Error:", error);
    next(error);
  }
};

// Read By ID
exports.getProcedure = async (req, res, next) => {
  try {
    const list = await ManufacturingProcedure.findAll({
      where: { deleted_at: null },
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateProcedure = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find department by primary key
    const manufacturing = await ManufacturingProcedure.findByPk(id);

    if (!manufacturing) {
      const error = new Error("Manufacturing entry not found.");
      error.status = 404;
      return next(error);
    }

    // Destructure fields from request body
    const { name } = req.body;

    // Update department
    await manufacturing.update({
      name,
      user_id: req.admin.id
    });

    // Return updated object
    res.status(200).json(manufacturing);
  } catch (error) {
    console.error("Update DepartmentMaster Error:", error);
    next(error);
  }
};

// Delete
exports.deleteProcedure = async (req, res, next) => {
  try {
    const manufacturing = await ManufacturingProcedure.findByPk(req.params.id);

    if (!manufacturing) {
      const error = new Error("ManufacturingProcedure entry not found");
      error.status = 404;
      return next(error);
    }

    await manufacturing.destroy();
    res.json({ message: "ManufacturingProcedure Master entry deleted" });
  } catch (error) {
    next(error);
  }
};
