const express = require("express");
const router = express.Router();
const guardController = require("../../controllers/inventory/guard/GuardEntryController");

// List by user_id
router.get("/api/guard-entries", guardController.guardEntry);

// Create
router.post("/api/guard-entries", guardController.store);

// Update
router.put("/api/guard-entries/:id", guardController.updateGuardEntry);

// Delete
router.delete("/api/guard-entries/:id", guardController.deleteGuardEntry);

module.exports = router;
