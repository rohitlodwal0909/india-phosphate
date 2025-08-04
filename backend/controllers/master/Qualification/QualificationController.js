const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Qualification } = db;

// Create
exports.createQualification = async (req, res ,next) => {
  try {
    const { qualification_name, status } = req.body;
    const newQualification = await Qualification.create({
      qualification_name,
      status
    });

  
    res.status(201).json(newQualification);
  } catch (error) {
    next(error)
  }
};

exports.getQualificationById = async (req, res,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications)
    {
      const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)
    }

    res.json(Qualifications);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllQualification = async (req, res ,next) => {
  try {
    const Qualifications = await Qualification.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(Qualifications);
  } catch (error) {
    next(error)
  }
};


// Update
exports.updateQualification = async (req, res,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications) {
    const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)
    }

    const { qualification_name, status  } = req.body;

    await Qualifications.update({
      qualification_name,
      status
    });



    res.json(Qualifications);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteQualification = async (req, res ,next) => {
  try {
    const Qualifications = await Qualification.findByPk(req.params.id);
    if (!Qualifications){   const error = new Error( "Qualification entry not found" );
       error.status = 404;
      return next(error)}
    await Qualifications.destroy();
    res.json({ message: "Qualification entry deleted" });
  } catch (error) {
   next(error)
  }
};