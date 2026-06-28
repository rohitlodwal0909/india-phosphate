const jwt = require("jsonwebtoken");
const { User } = require("../models");

const allowedIPs = ["192.168.1.10", "172.18.0.1", "127.0.0.1"];

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    // Save logged in user
    req.admin = user;

    // Access = true => Skip IP Check
    if (user.access === true) {
      return next();
    }

    // Access = false => Check IP
    let clientIP =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.ip ||
      "";

    if (clientIP.startsWith("::ffff:")) {
      clientIP = clientIP.replace("::ffff:", "");
    }

    if (clientIP.includes(",")) {
      clientIP = clientIP.split(",")[0].trim();
    }

    console.log("Client IP:", clientIP);

    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        message: "ERP Access Allowed Only From Company WiFi",
        clientIP
      });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};
