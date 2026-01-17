const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/usermanagment/UserController");

router.post("/register", UserController.register);

router.get("/user/all", UserController.listAllUsers);

router.delete("/user/delete/:id", UserController.delete);

router.put("/update-password", UserController.updatePassword);

module.exports = router;
