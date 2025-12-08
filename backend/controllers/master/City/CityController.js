const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { City, State, User } = db;

// Create
exports.createCity = async (req, res, next) => {
  try {
    const { city_name, pincode, state_id, created_by } = req.body;

    if (!Array.isArray(city_name) || !Array.isArray(pincode)) {
      return res
        .status(400)
        .json({ message: "City name & pincode must be array" });
    }

    const user_id = created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    let insertedCities = [];

    // Insert each pair of city + pincode
    for (let i = 0; i < city_name.length; i++) {
      const newCity = await City.create({
        city_name: city_name[i],
        pincode: pincode[i],
        state_id,
        created_by
      });

      insertedCities.push(newCity);

      const logMessage = `City '${city_name[i]}' with pincode '${pincode[i]}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

      await createLogEntry({
        user_id: user_id,
        message: logMessage
      });
    }

    res.status(201).json({
      message: "Cities inserted successfully",
      data: insertedCities
    });
  } catch (error) {
    next(error);
  }
};

exports.getCityById = async (req, res, next) => {
  try {
    const Citys = await City.findByPk(req.params.id);
    if (!Citys) {
      const error = new Error("City entry not found");
      error.status = 404;
      return next(error);
    }
    res.json(Citys);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllCity = async (req, res, next) => {
  try {
    const states = await State.findAll({
      include: [
        {
          model: City,
          as: "cities", // Must match alias in hasMany
          attributes: ["id", "city_name", "pincode"]
        }
      ],
      attributes: ["id", "state_name"]
    });

    res.status(200).json(states);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateCity = async (req, res, next) => {
  try {
    const cityRecord = await City.findByPk(req.params.id);

    if (!cityRecord) {
      const error = new Error("City entry not found");
      error.status = 404;
      return next(error);
    }

    const { city_name, pincode, created_by } = req.body;

    const user_id = created_by || cityRecord.created_by;
    3;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];

    const logMessage = `City '${cityRecord.city_name}' (ID: ${cityRecord.id}) was updated by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    // Update record
    const updatedCity = await cityRecord.update({
      city_name,
      pincode,
      created_by
    });

    res.status(200).json({
      message: "City updated successfully",
      data: updatedCity
    });
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deleteCity = async (req, res, next) => {
  try {
    const Citys = await City.findByPk(req.params.id);
    if (!Citys) {
      const error = new Error("City entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = Citys.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `City id  '${Citys?.id}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id: user_id, message: logMessage });
    await Citys.destroy();
    res.json({ message: "City entry deleted" });
  } catch (error) {
    next(error);
  }
};
