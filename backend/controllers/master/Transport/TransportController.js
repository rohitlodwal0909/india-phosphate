const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Transport ,State} = db;

// Create
exports.createTransport = async (req, res,next ) => {
  try {
  req.body
    const newTransport = await Transport.create(req.body);
    res.status(201).json(newTransport);
  } catch (error) {
   next(error)
  }
};

exports.getTransportById = async (req, res,next) => {
  try {
    const Transports = await Transport.findByPk(req.params.id);
    if (!Transports){
      const error = new Error( "Transport entry not found");
       error.status = 404;
      return next(error); 
    }
    res.json(Transports);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllTransport = async (req, res,next ) => {
  try {
     const states = await Transport.findAll();

    res.status(200).json(states);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateTransport = async (req, res,next) => {
  try {
    const Transports = await Transport.findByPk(req.params.id);
    if (!Transports) {
       const error = new Error( "Transport entry not found");
       error.status = 404;
      return next(error); 
    
    }
    const { Transport_name, state_id } = req.body;
    await Transports.update({
      Transport_name,
      state_id
    });
    res.json(Transport);
  } catch (error) {
  next(error)
  }
};


// Delete
exports.deleteTransport = async (req, res,next) => {
  try {
    const Transports = await Transport.findByPk(req.params.id);
    if (!Transports)
     {
       const error = new Error( "Transport entry not found");
       error.status = 404;
      return next(error); 
     }
    await Transports.destroy();
    res.json({ message: "Transport entry deleted" });
  } catch (error) {
   next(error)
  }
};