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
        role_id: admin.role_id,
         phone :  admin?.phone ,
        address:  admin?.address,
       gender: admin?.gender,
      },
      permission: permissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Hide password from response
    });
     const permissions = await RolePermissionModel.findAll({
      where: {
        role_id: user.role_id
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      admin:user,
      permission: permissions
     });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
   const userId = req.params.id // Assuming user ID is set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const admin = await User.findByPk(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const { name, email, password ,phone ,address, gender,role_id } = req.body;

    // Optional: check for duplicate email if updating
    if (email && email !== admin.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updateData = {
      name: name ?? admin.name,
      email: email ?? admin.email,
      phone : phone ?? admin?.phone ,
      address: address ?? admin?.address,
      gender: gender ?? admin?.gender,
      role_id:role_id??  admin?.role_id
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }
    await admin.update(updateData);
    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
         phone : admin?.phone ,
        address:admin?.address,
        gender:admin?.gender,
        role_id:  admin?.role_id
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
