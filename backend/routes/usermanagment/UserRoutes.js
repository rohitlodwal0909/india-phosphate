const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/usermanagment/UserController");

router.post("/api/register", UserController.register);

router.get("/api/user/all", UserController.listAllUsers);

router.delete("/api/user/delete/:id", UserController.delete);

module.exports = router;
