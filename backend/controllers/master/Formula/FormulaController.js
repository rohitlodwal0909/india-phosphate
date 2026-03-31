const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");
const { Formula, User, ProductFormulaSpecification } = db;

// Create
exports.createFormula = async (req, res, next) => {
  try {
    const created_by = req?.admin?.id;

    // add created_by into payload
    const payload = {
      ...req.body,
      created_by: created_by
    };

    const data = await Formula.create(payload);

    // Create log
    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Formula name '${data?.formula_name}' was created by '${req?.admin?.username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req?.admin?.id,
      message: logMessage
    });

    return res.status(201).json({
      success: true,
      message: "Formula created successfully",
      data: data
    });
  } catch (err) {
    next(err);
  }
};

exports.createSpecification = async (req, res, next) => {
  try {
    const { formula_id, fields } = req.body;

    // delete old
    await ProductFormulaSpecification.destroy({
      where: { formula_id }
    });

    // bulk create new
    const payload = fields.map((item) => ({
      formula_id,
      test: item.test,
      specification: item.specification
    }));

    await ProductFormulaSpecification.bulkCreate(payload);

    res.status(200).json({ message: "Specification saved successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getSpecificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await ProductFormulaSpecification.findAll({
      where: {
        formula_id: id
      }
    });

    // ✅ Proper empty check
    if (!data || data.length === 0) {
      return res.json([]); // frontend ke liye clean response
    }

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getFormulaById = async (req, res, next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas) {
      const error = new Error("Formula entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(Formulas);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllFormula = async (req, res, next) => {
  try {
    const Formulas = await Formula.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(Formulas);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateFormula = async (req, res, next) => {
  try {
    const formulas = await Formula.findByPk(req.params.id);
    if (!formulas) {
      const error = new Error("Formula not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req?.admin?.id;

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Formula name '${formulas?.formula_name}' was updated by '${req?.admin?.username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await formulas.update(req.body);
    res.json({
      success: true,
      message: "Formula updated successfully",
      data: formulas
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteFormula = async (req, res, next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas) {
      const error = new Error("Formula entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req?.admin?.id;

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Formula name '${Formulas?.formula_name}' was deleted by '${req?.admin?.username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await Formulas.destroy();
    res.json({ message: "Finish Good entry deleted" });
  } catch (error) {
    next(error);
  }
};
