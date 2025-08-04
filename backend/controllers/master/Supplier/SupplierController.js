const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Supplier,User} = db;

// Create
exports.createSupplier = async (req, res,next) => {
  try {
    const { supplier_name, email, address, contact_no, user_id } = req.body;
    const existingSupplier = await Supplier.findOne({ where: { email } });
    if (existingSupplier) {
      const error = new Error( "A supplier with this email already exists.");
       error.status = 400;
      return next(error);
    }
    // Create the supplier entry
    const newSupplier = await Supplier.create({
      supplier_name,
      email,
      address,
      contact_no,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Supplier '${supplier_name}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
next(error)
  }
};

exports.getSupplierById = async (req, res,next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier)
     {const error = new Error("Supplier entry not found");
       error.status = 404;
      return next(error)}

    res.json(supplier);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllSupplier = async (req, res,next) => {
  try {
    const suppliers = await Supplier.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(suppliers);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateSupplier = async (req, res,next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
    const error = new Error("Supplier entry not found");
       error.status = 404;
      return next(error)
    }

    const { supplier_name, email, address, contact_no } = req.body;

    await supplier.update({
      supplier_name,
      email,
      address,
      contact_no,
    });

    const user_id = supplier.user_id;
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Supplier '${supplier_name}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json(supplier);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteSupplier = async (req, res,next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier)
    {const error = new Error("Supplier entry not found");
       error.status = 404;
      return next(error)}
      const user_id = req.body?.user_id;
       const now = new Date();
      const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
      const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Supplier Name ${supplier?.supplier_name}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });
    await supplier.destroy();
    res.json({ message: "Supplier entry deleted" });
  } catch (error) {
next(error)
  }
};