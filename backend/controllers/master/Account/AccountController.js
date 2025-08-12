const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Account, User} = db;


// Create Department
exports.createAccount = async (req, res, next) => {
  try {
    const {
      account_name,
      account_type,
      parent_account,
      opening_balance,
      balance_type,
      is_active,
      created_by
    } = req.body;

    // Check for duplicate account_name
    const existingAccount = await Account.findOne({
      where: { account_name }
    });

    if (existingAccount) {
      const error = new Error("An account with this name already exists.");
      error.status = 400;
      return next(error);
    }

    // Create new account entry
    const newAccount = await Account.create({
      account_name,
      account_type,
      parent_account,
      opening_balance,
      balance_type,
      is_active,
      created_by
    });
const user_id  = created_by
     const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];        // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0];       // HH:mm:ss
    const logMessage = `Account name ${account_name} was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id:created_by,
      message: logMessage,
    });

    res.status(201).json(newAccount);
  } catch (error) {
    next(error);
  }
};


exports.getAccountById = async (req, res,next) => {
  try {
    const Accounts = await Account.findByPk(req.params.id);
    if (!Accounts){
       const error = new Error( "Account entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(Accounts);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllAccount = async (req, res, next) => {
  try {
    const departmentList = await Account.findAll({
      where: { deleted_at: null },
      order: [['created_at', 'DESC']],
    });

    const resultWithUsernames = await Promise.all(
      departmentList.map(async (dept) => {
        const user = await User.findOne({
          where: { id: dept.created_by },
          attributes: ['username'],
        });
        return {
          ...dept.toJSON(),
          created_by_username: user?.username || null,
        };
      })
    );

    res.status(200).json(resultWithUsernames);
  } catch (error) {
    next(error);
  }
};


// Update
exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.params.id;

const account_id = id
    // Find account by primary key
    const accounts = await Account.findByPk(account_id);

    if (!accounts) {
      const error = new Error("Account entry not found.");
      error.status = 404;
      return next(error);
    }

    // Destructure valid fields from request body
    const {
      account_name,
      account_type,
      parent_account,
      opening_balance,
      balance_type,
      is_active,
      created_by
    } = req.body;

    // Update account
    await accounts.update({
      account_name,
      account_type,
      parent_account,
      opening_balance,
      balance_type,
      is_active,
      created_by
    });
const user_id  = created_by
      const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
         const now = new Date();
        const entry_date = now.toISOString().split("T")[0];
        const entry_time = now.toTimeString().split(" ")[0];
    
        const logMessage = `Account name '${account_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: created_by, message: logMessage });
    // Return updated account
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Update Account Error:", error);
    next(error);
  }
};



// Delete
exports.deleteAccount = async (req, res,next) => {
  try {
    const Accounts = await Account.findByPk(req.params.id);

    if (!Accounts){ const error = new Error( "Account entry not found" );
       error.status = 404;
      return next(error); 
     }
const user_id  = Accounts?.created_by
         const user = await User.findByPk(user_id);
        const username = user ? user.username : "Unknown User";
         const now = new Date();
        const entry_date = now.toISOString().split("T")[0];
        const entry_time = now.toTimeString().split(" ")[0];
    
        const logMessage = `Account name '${Accounts?.account_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
        await createLogEntry({ user_id: user_id, message: logMessage });
    // Return updated account
      
    await Accounts.destroy();
    res.json({ message: "Account entry deleted" });
  } catch (error) {
   next(error)
  }
};