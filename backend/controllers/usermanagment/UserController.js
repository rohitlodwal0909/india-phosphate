const bcrypt = require("bcryptjs");
const db = require("../../models");
const { User } = db;


exports.register = async (req, res,next) => {
  const { username, email, password, role_id } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
       const error = new Error( "Email already exists");
       error.status = 400;
      return next(error); 
     
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id,
      status: "Inactive" // default status
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        status: user.status
      }
    });
  } catch (error) {
   next(error)
  }
};

exports.delete = async (req, res,next) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id } });

    if (!user) {
       const error = new Error( "User not found");
       error.status = 404;
      return next(error); 
    
    }

    // Soft delete user (paranoid: true in model will auto set deleted_at)
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
 next(error)
  }
};

exports.listAllUsers = async (req, res,next) => {
  try {
    const users = await User.findAll({ paranoid: true }); // Includes deleted users
    res.status(200).json(users);
  } catch (error) {
    next(error)
  }
};
