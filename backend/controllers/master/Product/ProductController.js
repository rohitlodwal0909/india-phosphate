const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");
const { Product } = db;

// Create
exports.createProduct = async (req, res, next) => {
  try {
    const { product_name } = req.body;

    const newProduct = await Product.create({
      product_name,
      user_id: req.admin.id
    });

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Product name '${product_name}' was created by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateProduct = async (req, res, next) => {
  try {
    const products = await Product.findByPk(req.params.id);
    if (!products) {
      const error = new Error("Product entry not found");
      error.status = 404;
      return next(error);
    }

    const { product_name } = req.body;

    await products.update({
      product_name
    });

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Product name '${product_name}' was updated by ${req.admin.username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id: req.admin.id,
      message: logMessage
    });

    res.json(Product);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deleteProduct = async (req, res, next) => {
  try {
    const products = await Product.findByPk(req.params.id);
    if (!products) {
      const error = new Error("Product entry not found");
      error.status = 404;
      return next(error);
    }

    await products.destroy();
    res.json({ message: "Product entry deleted" });
  } catch (error) {
    next(error);
  }
};
