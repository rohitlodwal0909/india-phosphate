const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Grade, User } = db;

// Create
exports.createGrade = async (req, res, next) => {
  try {
    const { grade } = req.body;

    const newGrade = await Grade.create({
      grade,
      user_id: req.admin.id
    });

    res.status(201).json(newGrade);
  } catch (error) {
    next(error);
  }
};

exports.getGradeById = async (req, res, next) => {
  try {
    const grades = await Grade.findByPk(req.params.id);
    if (!grades) {
      const error = new Error("Grade entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(grades);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllGrade = async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateGrade = async (req, res, next) => {
  try {
    const grades = await Grade.findByPk(req.params.id);
    if (!grades) {
      const error = new Error("Grade entry not found");
      error.status = 404;
      return next(error);
    }

    const { grade } = req.body;

    await grades.update({
      grade
    });

    res.json(Grade);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deleteGrade = async (req, res, next) => {
  try {
    const grades = await Grade.findByPk(req.params.id);
    if (!grades) {
      const error = new Error("Grade entry not found");
      error.status = 404;
      return next(error);
    }

    await grades.destroy();
    res.json({ message: "Grade entry deleted" });
  } catch (error) {
    next(error);
  }
};
