const express = require("express");
const router = express.Router();
const DisputeController = require("../../controllers/marketing/Dispute/DisputeController");

router.get("/get-poandsample/:name", DisputeController.getpoandsample);

// Get All Purchase Orders
router.get("/get-disputes", DisputeController.getDisputes);

// Store Purchase Order
router.post("/store-dispute", DisputeController.storeDispute);

// Update Purchase Order
router.put("/update-dispute/:id", DisputeController.updateAudit);

// Delete Purchase Order
router.delete("/delete-dispute/:id", DisputeController.deleteAudit);

module.exports = router;
