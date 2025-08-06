const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { CurrencyMaster } = db;

// Create
exports.create = async (req, res) => {
  try {
    const data = await CurrencyMaster.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await CurrencyMaster.findAll();
    res.status(200).json(data);
  } catch (err) {
     next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await CurrencyMaster.findByPk(req.params.id);
    if (!data){ 
       const error = new Error( "Currency  not found" );
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
    const updated = await CurrencyMaster.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({ message: "Currency updated successfully" });
  } catch (err) {
  next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
    await CurrencyMaster.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Currency deleted successfully" });
   } catch (err) {
      next(err)
  }
};