const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authentication/AuthController");

router.post("/api/login", AuthController.login);

module.exports = router;
