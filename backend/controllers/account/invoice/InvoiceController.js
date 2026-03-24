const { where } = require("sequelize");
const db = require("../../../models");
const { PurchaseOrderModel, Customer, User, DispatchVehicle } = db;

exports.getEntryInvoice = async (req, res) => {
  try {
    const { status } = req.query;

    let condition = {};

    if (status == 1) {
      condition = { domestic: true };
    } else if (status == 2) {
      condition = { export: true };
    }

    const data = await DispatchVehicle.findAll({
      include: [
        {
          model: PurchaseOrderModel,
          as: "poentry",
          where: condition,
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "username"]
            },
            {
              model: Customer,
              as: "customers"
            }
          ]
        }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
