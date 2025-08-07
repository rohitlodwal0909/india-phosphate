const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Outword } = db;
const moment = require('moment');
// Create
exports.createOutward = async (req, res,next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const countToday = await Outword.count({
      where: {
        outword_date: today
      }
    });

    const serial = String(countToday + 1).padStart(3, "0");

    const outwordNumber = `OUT-${moment().format("YYYYMMDD")}-${serial}`;

    const outword = await Outword.create({
      outword_number: outwordNumber,
      outword_date: today,
      vendor_id: req.body.vendor_id,
      item: req.body.item,
      quantity: req.body.quantity,
      uom: req.body.uom,
      vehicle_number: req.body.vehicle_number,
      received_by: req.body.received_by,
      purpose: req.body.purpose,
      remarks: req.body.remarks,
      created_by:req.body.created_by
    });

    res.status(201).json(outword);
  } catch (err) {
    next(err);
  }
};

exports.getOutwardById = async (req, res, next) => {
  try {
    const Outward = await Outword.findByPk(req.params.id);
    if (!Outward) {
      const error = new Error("Outward entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(Outward);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllOutward = async (req, res, next) => {
  try {
    const Outward = await Outword.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(Outward);
  } catch (error) {
    next(error);
  }
};

// Update

exports.updateOutward = async (req, res,next) => {
  try {
    const id = req.params.id;
    const outward = await Outword.findByPk(id);

    if (!outward) {
      const error = new Error("Outward entry not found");
      error.status = 404;
      return next(error);
    }

    // Update allowed fields only
    await outward.update({
      vendor_id: req.body.vendor_id || outward.vendor_id,
      item: req.body.item || outward.item,
      quantity: req.body.quantity || outward.quantity,
      uom: req.body.uom || outward.uom,
      vehicle_number: req.body.vehicle_number || outward.vehicle_number,
       purpose: req.body.purpose || outward.purpose,
      remarks: req.body.remarks || outward.remarks,
    });

    res.json({
      message: "Outward updated successfully.",
      outward
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteOutward = async (req, res, next) => {
  try {
    const Outward = await Outword.findByPk(req.params.id);
    if (!Outward) {
      const error = new Error("Outward entry not found");
      error.status = 404;
      return next(error);
    }
    await Outward.destroy();
    res.json({ message: "Outward entry deleted" });
  } catch (error) {
    next(error);
  }
};