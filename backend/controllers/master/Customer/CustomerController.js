const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Customer, User} = db;

// Create
exports.createCustomer = async (req, res,next) => {
  try {
    const { customer_name, email, address, contact_no, user_id ,  gst_number,
    invoice_no,
    domestic} = req.body;
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
       const error = new Error( "A Customer with this email already exists." );
       error.status = 400;
      return next(error); 
     
    }
    // Create the Customer entry
    const newCustomer = await Customer.create({
      customer_name,
      email,
      address,
      contact_no,
        gst_number,
    invoice_no,
    domestic,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Customer '${customer_name}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
   next(error)
  }
};

exports.getCustomerById = async (req, res,next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer){
       const error = new Error( "Customer entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(customer);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllCustomer = async (req, res,next) => {
  try {
    const customers = await Customer.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(customers);
  } catch (error) {
    next(error)
  
  }
};


// Update
exports.updateCustomer = async (req, res,next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      const error = new Error( "Customer entry not found" );
       error.status = 404;
      return next(error); 
     
   
    }
    const { customer_name, email, address, contact_no, user_id,  gst_number,
    invoice_no,
    domestic } = req.body;

    await customer.update({
      customer_name,
      email,
      address,
      contact_no,
        gst_number,
    invoice_no,
    domestic,
      user_id
    });

  
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Customer '${customer_name}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json(Customer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    next(error)
  }
};


// Delete
exports.deleteCustomer = async (req, res,next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer){ const error = new Error( "Customer entry not found" );
       error.status = 404;
      return next(error); 
     }
      const user_id = req.body?.user_id || customer?.user_id;
       const now = new Date();
      const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
      const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Customer Name ${customer?.customer_name}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });

    await customer.destroy();
    res.json({ message: "Customer entry deleted" });
  } catch (error) {
   next(error)
  }
};