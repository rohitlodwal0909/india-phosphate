const express = require("express");
const router = express.Router();
const AuditController = require("../../controllers/marketing/Audit/AuditController");

// Get All Purchase Orders
router.get("/get-audit", AuditController.getAudit);

// Store Purchase Order
router.post("/store-audit", AuditController.storeAudit);

// Update Purchase Order
router.put("/update-audit/:id", AuditController.updateAudit);

// Delete Purchase Order
router.delete("/delete-audit/:id", AuditController.deleteAudit);

module.exports = router;
