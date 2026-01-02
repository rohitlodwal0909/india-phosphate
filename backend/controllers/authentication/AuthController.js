const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { User, RolePermissionModel, Log } = db;

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ where: { username } });

    if (!admin) {
      const error = new Error("Invalid Username");
      error.status = 404;
      return next(error); // send to global handler
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const error = new Error("Invalid Password");
      error.status = 401;
      return next(error); // send to global handler
    }

    await admin.update({ status: "active" });

    //  Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const permissions = await RolePermissionModel?.findAll({
      where: {
        role_id: admin?.role_id
      }
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.username,
        username: admin.username,
        role_id: admin.role_id,
        phone: admin?.phone,
        address: admin?.address,
        gender: admin?.gender,
        status: admin?.status
      },
      permission: permissions
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfileById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] } // Hide password from response
    });
    const permissions = await RolePermissionModel.findAll({
      where: {
        role_id: user.role_id
      }
    });
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      return next(error);
    }
    res.json({
      admin: user,
      permission: permissions
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming user ID is set by auth middleware
    if (!userId) {
      const error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }
    const admin = await User.findByPk(userId);
    if (!admin) {
      const error = new Error("Admin not found");
      error.status = 401;
      return next(error);
    }
    const { username, email, password, phone, address, gender, role_id } =
      req.body;
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile
      ? `/uploads/${profileImageFile.filename}`
      : admin.profile_image;
    // Optional: check for duplicate email if updating
    if (email && email !== admin.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        const error = new Error("Email already in use");
        error.status = 400;
        return next(error);
      }
    }

    const updateData = {
      username: username ?? admin.username,
      email: email ?? admin.email,
      phone: phone ?? admin?.phone,
      address: address ?? admin?.address,
      gender: gender ?? admin?.gender,
      role_id: role_id ?? admin?.role_id,
      profile_image: profileImagePath
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }
    await admin.update(updateData);
    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin?.phone,
        address: admin?.address,
        gender: admin?.gender,
        role_id: admin?.role_id,
        profile_image: admin?.profile_image
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { new_password, confirm_password } = req.body;
    if (!new_password) {
      const error = new Error("New password is required");
      error.status = 400;
      return next(error);
    }
    // Optional: Check confirm_password if frontend sends it
    if (confirm_password && new_password !== confirm_password) {
      const error = new Error("Passwords do not match");
      error.status = 400;
      return next(error);
    }

    const admin = await User.findByPk(userId);
    if (!admin) {
      const error = new Error("User not found");
      error.status = 401;
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await admin.update({ password: hashedPassword });
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("No user found with this email address");
      error.status = 400;
      return next(error);
    }

    // Send back user data (excluding password)
    res.json({
      message: "User found",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        role_id: user.role_id
      }
    });

    // OPTIONAL: Send reset password link / OTP email here
  } catch (error) {
    next(error);
  }
};

exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await Log.findAll({
      order: [["created_at", "DESC"]] // Sort by createdAt descending
    });
    res.status(200).json({
      message: "Logs fetched successfully",
      data: logs
    });
  } catch (error) {
    next(error);
  }
};
