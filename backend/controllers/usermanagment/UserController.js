const bcrypt = require("bcryptjs");
const db = require("../../models");
const { User } = db;


exports.register = async (req, res) => {
  const { username, email, password, role_id } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id,
      status: "active" // default status
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
    console.error("User registration error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete user (paranoid: true in model will auto set deleted_at)
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ paranoid: true }); // Includes deleted users
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch all users error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
