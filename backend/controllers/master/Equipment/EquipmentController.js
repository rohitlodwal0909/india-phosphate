const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Equipment } = db;

// Create
exports.create = async (req, res) => {
  try {
    const data = await Equipment.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await Equipment.findAll();
    res.status(200).json(data);
  } catch (err) {
     next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await Equipment.findByPk(req.params.id);
    if (!data){ 
       const error = new Error( "Equipment  not found" );
       error.status = 404;
      return next(error); 
    }
    res.status(200).json(data);
  } catch (err) {
    next(err)
  }
};

exports.update = async (req, res,next ) => {
  try {
    const updated = await Equipment.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (err) {
  next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
    await Equipment.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Equipment deleted successfully" });
   } catch (err) {
      next(err)
  }
};