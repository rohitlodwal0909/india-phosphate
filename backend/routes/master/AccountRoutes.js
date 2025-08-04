// routes/AccountRoutes.js
const express = require("express");
const router = express.Router();
const AccountController = require("../../controllers/master/Account/AccountController");


router.post("/store-account", AccountController.createAccount);
router.get("/get-account", AccountController.getAllAccount);
router.get("/view-account/:id", AccountController.getAccountById);
router.put("/update-account/:id", AccountController.updateAccount);
router.delete("/delete-account/:id", AccountController.deleteAccount);


module.exports = router;