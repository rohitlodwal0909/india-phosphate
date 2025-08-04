const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Inward } = db;

// Create
exports.createInward = async (req, res,next) => {
  try {
    const { inward_number } = req.body;
    const newInward = await Inward.create({
      inward_number,
    });

  
    res.status(201).json(newInward);
  } catch (error) {
   next(error)
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
    const Inwards = await Inward.findByPk(req.params.id);
    if (!Inwards) {
         const error = new Error( "Inward entry not found" );
       error.status = 404;
      return next(error)
    }

    const { inward_number,   } = req.body;

    await Inwards.update({
      inward_number,
      
    });



    res.json(Inwards);
  } catch (error) {
    next(error)
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