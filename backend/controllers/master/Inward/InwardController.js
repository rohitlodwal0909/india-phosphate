const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Inward } = db;
const moment = require('moment');
// Create
exports.createInward = async (req, res,next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const countToday = await Inward.count({
      where: {
        inward_date: today
      }
    });

    const serial = String(countToday + 1).padStart(3, "0");

    const inwardNumber = `INW-${moment().format("YYYYMMDD")}-${serial}`;

    const inward = await Inward.create({
      inward_number: inwardNumber,
      inward_date: today,
      vendor_id: req.body.vendor_id,
      item_id: req.body.item_id,
      quantity: req.body.quantity,
      uom: req.body.uom,
      vehicle_number: req.body.vehicle_number,
      created_by: req.body.created_by,
      remarks: req.body.remarks
    });

    res.status(201).json(inward);
  } catch (err) {
    next(err);
  }
};

exports.getInwardById = async (req, res,next) => {
  try {
    const Inwards = await Inward.findByPk(req.params.id);
    if (!Inwards){
       const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(Inwards);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllInward = async (req, res,next) => {
  try {
    const Inwards = await Inward.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(Inwards);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateInward = async (req, res,next) => {
  try {
    const id = req.params.id;
    const inward = await Inward.findByPk(id);

    if (!inward) {
       const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)
    }

    // Update allowed fields only
    await inward.update({
      vendor_id: req.body.vendor_id || inward.vendor_id,
      item_id: req.body.item_id || inward.item_id,
      quantity: req.body.quantity || inward.quantity,
      uom: req.body.uom || inward.uom,
      vehicle_number: req.body.vehicle_number || inward.vehicle_number,
      remarks: req.body.remarks || inward.remarks,
      
    });

    res.json({
      message: "Inward updated successfully.",
      inward
    });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteInward = async (req, res,next) => {
  try {
    const Inwards = await Inward.findByPk(req.params.id);
    if (!Inwards){   const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)}
    await Inwards.destroy();
    res.json({ message: "Inward entry deleted" });
  } catch (error) {
    next(error)
  }
};