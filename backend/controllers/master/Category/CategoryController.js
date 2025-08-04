const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Category ,User} = db;

// Create
exports.createCategory = async (req, res,next) => {
  try {
    const { category_name, user_id } = req.body;
 
    const newCategory = await Category.create({
      category_name,
      user_id
    });

    // Log entry setup
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // Fetch user name
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Category name '${category_name}' was created by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.status(201).json(newCategory);
  } catch (error) {
   next(error)
  }
};

exports.getCategoryById = async (req, res,next) => {
  try {
    const Category = await Category.findByPk(req.params.id);
    if (!Category){
         const error = new Error( "Category entry not found");
       error.status = 404;
      return next(error); 
}

    res.json(Category);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllCategory = async (req, res,next) => {
  try {
    const categorys = await Category.findAll({
     
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(categorys);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateCategory = async (req, res,next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
       const error = new Error( "Category entry not found");
       error.status = 404;
      return next(error); 
    
    }

    const { category_name, user_id  } = req.body;

    await category.update({
      category_name,
    });


    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Category name '${category_name}' was updated by ${username} on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage,
    });

    res.json(Category);
  } catch (error) {
   next(error)
  }
};


// Delete
exports.deleteCategory = async (req, res,next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
    { const error = new Error( "Category entry not found");
       error.status = 404;
      return next(error); 
    }
      const user_id = req.body?.user_id;
       const now = new Date();
      const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
      const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Category name ${category?.category_name}  was deleted by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message:logMessage
    });
    await category.destroy();
    res.json({ message: "Category entry deleted" });
  } catch (error) {
    next(error)
  }
};