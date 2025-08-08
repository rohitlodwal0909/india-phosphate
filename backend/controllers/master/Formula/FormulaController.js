const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Formula } = db;

// Create
exports.createFormula = async (req, res,next) => {
   try {
    const data = await Formula.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Formula created successfully',
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFormulaById = async (req, res,next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas){
       const error = new Error( "Formula entry not found" );
       error.status = 404;
      return next(error)
    }
   
    res.json(Formulas);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllFormula = async (req, res,next) => {
  try {
    const Formulas = await Formula.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(Formulas);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateFormula = async (req, res,next) => {
  try {
  const formulas = await Formula.findByPk(req.params.id);
    if (!formulas) {
      const error = new Error( 'Formula not found' );
       error.status = 404;
      return next(error)
    }
    await formulas.update(req.body);
    res.json({ success: true, message: 'Formula updated successfully', data: formulas });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteFormula = async (req, res,next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas){  
       const error = new Error( "Formula entry not found" );
       error.status = 404;
      return next(error)}
    await Formulas.destroy();
    res.json({ message: "Finish Good entry deleted" });
  } catch (error) {
    next(error)
  }
};