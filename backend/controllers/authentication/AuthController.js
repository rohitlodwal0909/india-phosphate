const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../../models");
const { User, RolePermissionModel } = db;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ where: { email: email } });

    if (!admin) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    //  Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const permissions = await RolePermissionModel.findAll({
      where: {
        role_id: admin.role_id
      }
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.username,
        email: admin.email,
        role_id: admin.role_id
      },
      permission: permissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
