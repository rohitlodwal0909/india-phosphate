const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No token provided."
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1]; // 👈 IMPORTANT

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // ya req.user
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};
