const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { SalesMaster, User} = db;

// Create
exports.createSalesMaster = async (req, res, next) => {
  try {
    const {
      invoice_no,
      invoice_date,
      customer_id,
      payment_mode,
      product_details,
      subtotal_amount,
      tax_amount,
      discount_amount,
      grand_total,
      paid_amount,
      balance_amount,
      status,
      created_by,
      remarks,
    } = req.body;

    // Optional duplicate check for invoice_no
    const existingInvoice = await SalesMaster.findOne({ where: { invoice_no } });

    if (existingInvoice) {
      const error = new Error("Invoice number already exists.");
      error.status = 400;
      return next(error);
    }

    const newEntry = await SalesMaster.create({
      invoice_no,
      invoice_date,
      customer_id,
      payment_mode,
      product_details,
      subtotal_amount,
      tax_amount,
      discount_amount,
      grand_total,
      paid_amount,
      balance_amount,
      status,
      created_by,
      remarks,
    });

    res.status(201).json({
      message: "Sales entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Create SalesMaster Error:", error);
    next(error);
  }
};


exports.getSalesMasterById = async (req, res,next) => {
  try {
    const SalesMasters = await SalesMaster.findByPk(req.params.id);
    if (!SalesMasters){
       const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(SalesMasters);
  } catch (error) {
  next(error)
  }
};

        // Read By ID
       exports.getAllSalesMaster = async (req, res, next) => {
  try {
    const makeList = await SalesMaster.findAll({
      where: {
        deleted_at: null
      },
      order: [['created_at', 'DESC']]
    });

    const resultWithUsernames = await Promise.all(
      makeList.map(async (make) => {
        const user = await User.findOne({
          where: { id: make.created_by },
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
exports.updateSalesMaster = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existingEntry = await SalesMaster.findByPk(id);

    if (!existingEntry) {
      const error = new Error("Sales entry not found");
      error.status = 404;
      return next(error);
    }

    const {
      invoice_no,
      invoice_date,
      customer_id,
      payment_mode,
      product_details,
      subtotal_amount,
      tax_amount,
      discount_amount,
      grand_total,
      paid_amount,
      balance_amount,
      status,
      created_by,
      remarks,
    } = req.body;

    await existingEntry.update({
      invoice_no,
      invoice_date,
      customer_id,
      payment_mode,
      product_details,
      subtotal_amount,
      tax_amount,
      discount_amount,
      grand_total,
      paid_amount,
      balance_amount,
      status,
      created_by,
      remarks,
      updated_at: new Date(),
    });

    res.status(200).json({
      message: "Sales entry updated successfully",
      data: existingEntry,
    });
  } catch (error) {
    console.error("Update SalesMaster Error:", error);
    next(error);
  }
};



// Delete
exports.deleteSalesMaster = async (req, res,next) => {
  try {
    const SalesMasters = await SalesMaster.findByPk(req.params.id);

    if (!SalesMasters){ const error = new Error( "Make master entry not found" );
       error.status = 404;
      return next(error); 
     }
      
    await SalesMasters.destroy();
    res.json({ message: "Make master entry deleted" });
  } catch (error) {
   next(error)
  }
};