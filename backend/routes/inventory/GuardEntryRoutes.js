const express = require("express");
const router = express.Router();
const guardController = require("../../controllers/inventory/guard/GuardEntryController");

// List by user_id
router.get("/guard-entries", guardController.guardEntry);

// Create
router.post("/guard-entries", guardController.store);

// Update
router.put("/guard-entries/:id", guardController.updateGuardEntry);

// Delete
router.delete("/guard-entries/:id", guardController.deleteGuardEntry);

module.exports = router;
