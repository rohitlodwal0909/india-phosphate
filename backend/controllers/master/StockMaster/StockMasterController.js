const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { StockMaster, User} = db;

// Create
exports.createStockMaster = async (req, res, next) => {
  try {
    const {
      item_type,
      item_id,
      item_name,
      item_code,
      batch_no,
      uom,
      quantity_in_stock,
      minimum_stock_level,
      reorder_level,
      location_id,
      rack_no,
      expiry_date,
      last_updated_by,
      status
    } = req.body;

    // Optional duplicate check for batch_no
    const existingStock = await StockMaster.findOne({ where: { batch_no } });

    if (existingStock) {
      const error = new Error("Batch number already exists in stock.");
      error.status = 400;
      return next(error);
    }

    const newStock = await StockMaster.create({
      item_type,
      item_id,
      item_name,
      item_code,
      batch_no,
      uom,
      quantity_in_stock,
      minimum_stock_level,
      reorder_level,
      location_id,
      rack_no,
      expiry_date,
      last_updated_by,
      last_updated_at: new Date(),
      status
    });

    res.status(201).json({
      message: "Stock entry created successfully",
      data: newStock
    });
  } catch (error) {
    console.error("Create StockMaster Error:", error);
    next(error);
  }
};

exports.getStockMasterById = async (req, res,next) => {
  try {
    const StockMasters = await StockMaster.findByPk(req.params.id);
    if (!StockMasters){
       const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(StockMasters);
  } catch (error) {
  next(error)
  }
};

        // Read By ID
       exports.getAllStockMaster = async (req, res, next) => {
  try {
    const makeList = await StockMaster.findAll({
      where: {
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });

    const resultWithUsernames = await Promise.all(
      makeList.map(async (make) => {
        const user = await User.findOne({
          where: { id: make.last_updated_by },
          attributes: ['username']
        });

        return {
          ...make.toJSON(),
          created_by_username: user?.username || null
        };
      })
    );

    res.status(200).json(resultWithUsernames);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateStockMaster = async (req, res, next) => {
  try {
    const stockId = req.params.id;

    const existingStock = await StockMaster.findByPk(stockId);

    if (!existingStock) {
      const error = new Error("Stock entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      item_type,
      item_id,
      item_name,
      item_code,
      batch_no,
      uom,
      quantity_in_stock,
      minimum_stock_level,
      reorder_level,
      location_id,
      rack_no,
      expiry_date,
      last_updated_by,
      status
    } = req.body;

    await existingStock.update({
      item_type,
      item_id,
      item_name,
      item_code,
      batch_no,
      uom,
      quantity_in_stock,
      minimum_stock_level,
      reorder_level,
      location_id,
      rack_no,
      expiry_date,
      last_updated_by,
      last_updated_at: new Date(),
      status
    });

    res.status(200).json({
      message: "Stock entry updated successfully",
      data: existingStock
    });
  } catch (error) {
    console.error("Update StockMaster Error:", error);
    next(error);
  }
};


// Delete
exports.deleteStockMaster = async (req, res,next) => {
  try {
    const StockMasters = await StockMaster.findByPk(req.params.id);

    if (!StockMasters){ const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
      
    await StockMasters.destroy();
    res.json({ message: "Make master entry deleted" });
  } catch (error) {
   next(error)
  }
};