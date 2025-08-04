const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { City ,State} = db;

// Create
exports.createCity = async (req, res,next ) => {
  try {
    const { city_name, state_id } = req.body;
    const newCity = await City.create({
      city_name,
      state_id
    });
    res.status(201).json(newCity);
  } catch (error) {
   next(error)
  }
};

exports.getCityById = async (req, res,next) => {
  try {
    const Citys = await City.findByPk(req.params.id);
    if (!Citys){
      const error = new Error( "City entry not found");
       error.status = 404;
      return next(error); 
    }
    res.json(Citys);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllCity = async (req, res,next ) => {
  try {
     const states = await State.findAll({
      include: [
        {
          model: City,
            as: 'cities', // Must match alias in hasMany
          attributes: ['id', 'city_name'],
        },
      ],
      attributes: ['id', 'state_name'],
    });

    res.status(200).json(states);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateCity = async (req, res,next) => {
  try {
    const Citys = await City.findByPk(req.params.id);
    if (!Citys) {
       const error = new Error( "City entry not found");
       error.status = 404;
      return next(error); 
    
    }
    const { city_name, state_id } = req.body;
    await Citys.update({
      city_name,
      state_id
    });
    res.json(City);
  } catch (error) {
  next(error)
  }
};


// Delete
exports.deleteCity = async (req, res,next) => {
  try {
    const Citys = await City.findByPk(req.params.id);
    if (!Citys)
     {
       const error = new Error( "City entry not found");
       error.status = 404;
      return next(error); 
     }
    await Citys.destroy();
    res.json({ message: "City entry deleted" });
  } catch (error) {
   next(error)
  }
};