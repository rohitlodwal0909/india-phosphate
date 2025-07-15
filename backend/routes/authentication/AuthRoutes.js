const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/authentication/AuthController");

router.post("/api/login", AuthController.login);
router.get("/api/get-profile/:id", AuthController.getProfileById);
router.put("/api/update-profile/:id", AuthController.updateProfile);
module.exports = router;
