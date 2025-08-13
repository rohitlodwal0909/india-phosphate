const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Purchase ,User} = db;
const moment = require('moment');
// Create
exports.createPurchase = async (req, res,next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const countToday = await Purchase.count({
      where: {
        purchase_date: today
      }
    });
    const serial = String(countToday + 1).padStart(3, "0");
    const purchaseNumber = `OUT-${moment().format("YYYYMMDD")}-${serial}`;
    const purchases = await Purchase.create({
      purchase_number: purchaseNumber,
      purchase_date: today,
      vendor_id: req.body.vendor_id,
      item: req.body.item,
      quantity: req.body.quantity,
      unit: req.body.unit,
      price: req.body.price,
      total_amount: req.body.total_amount,
      payment_terms: req.body.payment_terms,
      created_by: req.body.created_by,
      remarks: req.body.remarks
    });
          const user_id = req.body.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Purchase number '${purchaseNumber}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    res.status(201).json(purchases);
  } catch (err) {
    next(err);
  }
};

exports.getPurchaseById = async (req, res, next) => {
  try {
    const Purchases = await Purchase.findByPk(req.params.id);
    if (!Purchases) {
      const error = new Error("Purchase entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(Purchases);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllPurchase = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      order: [["created_at", "DESC"]]
    });
    res.status(200).json(purchases);
  } catch (error) {
    next(error);
  }
};

// Update

exports.updatePurchase = async (req, res,next) => {
  try {
    const id = req.params.id;
    const purchases = await Purchase.findByPk(id);

    if (!purchases) {
      return res.status(404).json({ message: "Purchase entry not found." });
    }

    // Update allowed fields only
    await purchases.update({
      vendor_id: req.body.vendor_id || purchases.vendor_id,
      item: req.body.item || purchases.item,
      quantity: req.body.quantity || purchases.quantity,
      unit: req.body.unit || purchases.unit,
      remarks: req.body.remarks || purchases.remarks,
      price: req.body.price || purchases.price,
      total_amount: req.body.total_amount || purchases.total_amount,
      payment_terms: req.body.payment_terms || purchases.payment_terms,
     
    });
  const user_id =  req.body.created_by   || purchases?.created_by 
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Purchase number '${purchases?.purchase_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    res.json({
      message: "Purchase updated successfully.",
      purchases
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deletePurchase = async (req, res, next) => {
  try {
    const purchases = await Purchase.findByPk(req.params.id);
    if (!purchases) {
      const error = new Error("Purchase entry not found");
      error.status = 404;
      return next(error);
    }
      const user_id =    req.body.user_id ||  purchases?.created_by
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Purchase number '${purchases?.purchase_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await purchases.destroy();
    res.json({ message: "Purchase entry deleted" });
  } catch (error) {
    next(error);
  }
};