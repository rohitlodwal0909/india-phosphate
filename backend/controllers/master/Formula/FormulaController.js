const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Formula,User } = db;

// Create
exports.createFormula = async (req, res,next) => {
   try {
    const data = await Formula.create(req.body);
           const user_id =  data?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Formula name '${data?.formula_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });

    return res.status(201).json({
      success: true,
      message: 'Formula created successfully',
      data: data,
    });

  } catch (err) {
    next(err);
  }
};

exports.getFormulaById = async (req, res,next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas){
       const error = new Error( "Formula entry not found" );
       error.status = 404;
      return next(error)
    }
       
    res.json(Formulas);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllFormula = async (req, res,next) => {
  try {
    const Formulas = await Formula.findAll({
     
      order: [['created_at', 'DESC']]
    });
    

    res.status(200).json(Formulas);
  } catch (error) {
   next(error)
  }
};


// Update
exports.updateFormula = async (req, res,next) => {
  try {
  const formulas = await Formula.findByPk(req.params.id);
    if (!formulas) {
      const error = new Error( 'Formula not found' );
       error.status = 404;
      return next(error)
    }
const user_id = req.body?.created_by || formulas?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Formula name '${formulas?.formula_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await formulas.update(req.body);
    res.json({ success: true, message: 'Formula updated successfully', data: formulas });
  } catch (err) {
    next(err);
  }
};



// Delete
exports.deleteFormula = async (req, res,next) => {
  try {
    const Formulas = await Formula.findByPk(req.params.id);
    if (!Formulas){  
       const error = new Error( "Formula entry not found" );
       error.status = 404;
      return next(error)}
       const user_id = req?.body?.user_id || Formulas?.created_by;
      const user = await User.findByPk(user_id);
     const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Formula name '${Formulas?.formula_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    await Formulas.destroy();
    res.json({ message: "Finish Good entry deleted" });
  } catch (error) {
    next(error)
  }
};