const express = require("express");
const router = express.Router();
const grnController = require("../../controllers/inventory/grnEntry/GrnEntryController");

// List by user_id
router.get("/api/grn-entries", grnController.index);

// Create
router.post("/api/grn-entries", grnController.store);

// Update
router.put("/api/grn-entries/:id", grnController.update);

// Delete
router.delete("/api/grn-entries/:id", grnController.destroy);

// Show
router.get("/api/grn-entries/:id", grnController.show); // Get by ID

module.exports = router;
