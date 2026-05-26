const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Customer } = db;

exports.getallCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]]
    });
    res.status(200).json({
      message: "customers fetched successfully",
      data: customers
    });
  } catch (error) {
    next(error);
  }
};
