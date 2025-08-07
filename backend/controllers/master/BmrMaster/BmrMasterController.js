const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { BmrMaster } = db;

// Create
exports.create = async (req, res ,next) => {
  try {
    const data = await BmrMaster.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err)
  }
};

exports.findAll = async (req, res,next) => {
  try {
    const data = await BmrMaster.findAll();
    res.status(200).json(data);
  } catch (err) {
     next(err)
  }
};

exports.findOne = async (req, res,next) => {
  try {
    const data = await BmrMaster.findByPk(req.params.id);
    if (!data){ 
       const error = new Error( "Bmr   not found" );
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
    const updated = await BmrMaster.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({ message: "Bmr  updated successfully" });
  } catch (err) {   
  next(err)
  }
};

exports.delete = async (req, res,next) => {
  try {
    await BmrMaster.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Bmr deleted successfully" });
   } catch (err) {
      next(err)
  }
};