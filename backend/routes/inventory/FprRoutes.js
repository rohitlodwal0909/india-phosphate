const express = require("express");
const router = express.Router();
const FPRController = require("../../controllers/inventory/fpr/FPRController");

// List by user_id
router.get("/get-approved-batch", FPRController.index);

// Create
router.post("/add-fpr", FPRController.store);

module.exports = router;
