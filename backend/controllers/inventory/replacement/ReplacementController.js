const db = require("../../../models");
const { ReplacementModel, DispatchVehicle } = db;

exports.index = async (req, res, next) => {
  try {
    const data = await ReplacementModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: DispatchVehicle,
          as: "invoices",
          attributes: ["id", "invoice_no"]
        }
      ]
    });

    res.status(200).json({ message: "Replacement Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

// Create GRN Entry
exports.store = async (req, res, next) => {
  try {
    const data = await ReplacementModel.create({
      ...req.body
    });

    res.status(201).json({
      message: "Replacement created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
