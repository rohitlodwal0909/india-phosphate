const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { FinishGood } = db;
const moment = require('moment');
// Create
exports.createFinishGood = async (req, res,next) => {
   try {
    const {
      product_code,
      product_name,
      product_description,
      batch_size,
      unit_of_measure,
      packing_details,
      hsn_code,
      gst_rate,
      shelf_life,
      storage_condition,
      mrp,
      created_by
    } = req.body;

    const newFinishGood = await FinishGood.create({
      product_code,
      product_name,
      product_description,
      batch_size,
      unit_of_measure,
      packing_details,
      hsn_code,
      gst_rate,
      shelf_life,
      storage_condition,
      mrp,
      created_by,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Finish good created successfully',
      data: newFinishGood,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFinishGoodById = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findByPk(req.params.id);
    if (!FinishGoods){
       const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(FinishGoods);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllFinishGood = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(FinishGoods);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateFinishGood = async (req, res,next) => {
  try {
    const { id } = req.params;
    // Check if record exists
    const existingFinishGood = await FinishGood.findByPk(id);

    if (!existingFinishGood) {
      const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)
    }

    // Update record
    await existingFinishGood.update({
      ...req.body
    });

    res.json({
      message: "Finish Good updated successfully.",
      existingFinishGood
    });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteFinishGood = async (req, res,next) => {
  try {
    const FinishGoods = await FinishGood.findByPk(req.params.id);
    if (!FinishGoods){   const error = new Error( "Finish Good entry not found" );
       error.status = 404;
      return next(error)}
    await FinishGoods.destroy();
    res.json({ message: "Finish Good entry deleted" });
  } catch (error) {
    next(error)
  }
};