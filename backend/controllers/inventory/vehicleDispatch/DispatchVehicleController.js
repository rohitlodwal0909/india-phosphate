const db = require("../../../models");
const { DispatchVehicle } = db;

exports.dispatchvehicleEntry = async (req, res) => {
  try {
    const now = new Date();
    const dispatch_date = now.toISOString().slice(0, 19).replace('T', ' '); // YYYY-MM-DD HH:MM:SS format

    const entryData = { ...req.body, dispatch_date };
    const newEntry = await DispatchVehicle.create(entryData);

    res.status(201).json({
      message: "Dispatch Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    console.error("Error in Dispatch Entry Store:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


exports.getAllDispatchVehicles = async (req, res) => {
  try {
    const entries = await DispatchVehicle.findAll();
    res.status(200).json({ data: entries });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateDispatchVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await DispatchVehicle.update(req.body, { where: { id } });
    res.status(200).json({ message: 'Dispatch Entry updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.deleteDispatchVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await DispatchVehicle.destroy({ where: { id } });
    res.status(200).json({ message: 'Dispatch Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

