const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Customer, PurchaseOrderModel, DispatchVehicle, DisputeModel } = db;

exports.getallCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]]
    });

    const total_orders = await PurchaseOrderModel.count();

    const pending_orders = await DispatchVehicle.count({
      include: [
        {
          model: PurchaseOrderModel,
          as: "poentry"
        }
      ]
    });

    const total_disputes = await DisputeModel.count();

    res.status(200).json({
      message: "customers fetched successfully",
      customers,
      total_orders,
      pending_orders,
      total_disputes
    });
  } catch (error) {
    next(error);
  }
};
