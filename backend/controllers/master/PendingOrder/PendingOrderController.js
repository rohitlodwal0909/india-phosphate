const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { PendingOrder, User} = db;

// Create
exports.createPendingOrder = async (req, res, next) => {
  try {
    const {
      order_number,
      customer_name_or_id,
      order_date,
      expected_delivery_date,
      products_ordered, // stringified JSON
      total_quantity,
      quantity_delivered,
      remarks,
      order_status,
    } = req.body;

    // Optional: Check for duplicate order_number
    const existingOrder = await PendingOrder.findOne({
      where: { order_number },
    });

    if (existingOrder) {
      const error = new Error("Order number already exists.");
      error.status = 400;
      return next(error);
    }

    const quantity_pending = total_quantity - quantity_delivered;

    const newOrder = await PendingOrder.create({
      order_number,
      customer_name_or_id,
      order_date,
      expected_delivery_date,
      products_ordered,
      total_quantity,
      quantity_delivered,
      remarks,
      order_status,
      quantity_pending,
    });

    res.status(201).json({
      message: "Pending order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Create PendingOrder Error:", error);
    next(error);
  }
};

exports.getPendingOrderById = async (req, res,next) => {
  try {
    const PendingOrders = await PendingOrder.findByPk(req.params.id);
    if (!PendingOrders){
       const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(PendingOrders);
  } catch (error) {
  next(error)
  }
};

        // Read By ID
       exports.getAllPendingOrder = async (req, res, next) => {
  try {
    const makeList = await PendingOrder.findAll({
      where: {
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(makeList);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updatePendingOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const existingOrder = await PendingOrder.findByPk(orderId);

    if (!existingOrder) {
      const error = new Error("Pending order entry not found.");
      error.status = 404;
      return next(error);
    }

    const {
      order_number,
      customer_name_or_id,
      order_date,
      expected_delivery_date,
      products_ordered,
      total_quantity,
      quantity_delivered,
      remarks,
      order_status,
    } = req.body;

    const quantity_pending = total_quantity - quantity_delivered;

    await existingOrder.update({
      order_number,
      customer_name_or_id,
      order_date,
      expected_delivery_date,
      products_ordered,
      total_quantity,
      quantity_delivered,
      quantity_pending,
      remarks,
      order_status,
    });

    res.status(200).json({
      message: "Pending order updated successfully",
      data: existingOrder,
    });
  } catch (error) {
    console.error("Update PendingOrder Error:", error);
    next(error);
  }
};



// Delete
exports.deletePendingOrder = async (req, res,next) => {
  try {
    const PendingOrders = await PendingOrder.findByPk(req.params.id);

    if (!PendingOrders){ const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
      
    await PendingOrders.destroy();
    res.json({ message: "Make master entry deleted" });
  } catch (error) {
   next(error)
  }
};