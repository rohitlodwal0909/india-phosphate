const express = require("express");
const router = express.Router();
const grnController = require("../../controllers/inventory/grnEntry/GrnEntryController");

// List by user_id
router.get("/grn-entries", grnController.index);

// Create
router.post("/grn-entries", grnController.store);

// Update
router.put("/grn-entries/:id", grnController.update);

// Delete
router.delete("/grn-entries/:id", grnController.destroy);

// Show
router.get("/grn-entries/:id", grnController.show); // Get by ID

module.exports = router;
