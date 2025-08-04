const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Designation } = db;

// Create
exports.createDesignation = async (req, res,next) => {
  try {
    const { designation_name, status } = req.body;
    const newDesignation = await Designation.create({
      designation_name,
      status
    });
    res.status(201).json(newDesignation);
  } catch (error) {
   next(error)
  }
};

exports.getDesignationById = async (req, res,next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations){
       const error = new Error( "Designation entry not found" );
       error.status = 404;
      return next(error)
    
}
    res.json(Designations);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllDesignation = async (req, res,next) => {
  try {
    const Designations = await Designation.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(Designations);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateDesignation = async (req, res,next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations) {
      const error = new Error( "Designation entry not found" );
       error.status = 404;
      return next(error)
    }

    const { designation_name, status  } = req.body;

    await Designations.update({
      designation_name,
      status
    });



    res.json(Designations);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteDesignation = async (req, res,next) => {
  try {
    const Designations = await Designation.findByPk(req.params.id);
    if (!Designations){ 
       const error = new Error( "Designation entry not found" );
       error.status = 404;
      return next(error)}
    await Designations.destroy();
    res.json({ message: "Designation entry deleted" });
  } catch (error) {
   next(error)
  }
};