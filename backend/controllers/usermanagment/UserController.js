const bcrypt = require("bcryptjs");
const db = require("../../models");
const { User } = db;
const fs = require("fs");
const path = require("path");

exports.register = async (req, res, next) => {
  const { username, password, role_id } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    // Signature check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Signature is required"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      showpassword: password,
      signature: `${req.file.filename}`, // save full path
      role_id,
      status: "Inactive"
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        status: user.status,
        signature: user.signature
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id } });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    // Soft delete user (paranoid: true in model will auto set deleted_at)
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.listAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ paranoid: true }); // Includes deleted users
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { username, password, role_id, id } = req.body;

    // 🔍 Find user
    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Password hash
    let hashedPassword = existingUser.password;
    let showPassword = existingUser.showpassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      showPassword = password;
    }

    // 🖼️ Handle signature replace
    let signature = existingUser.signature;
    if (req.file) {
      signature = req.file.filename;
    }

    // ✏️ Update user
    await existingUser.update({
      username,
      password: hashedPassword,
      showpassword: showPassword,
      signature,
      role_id,
      status: "active"
    });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: existingUser.id,
        username: existingUser.username,
        role_id: existingUser.role_id,
        status: existingUser.status,
        signature: existingUser.signature
      }
    });
  } catch (error) {
    next(error);
  }
};
