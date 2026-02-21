const express = require("express");
const router = express.Router();
const ProductionController = require("../../controllers/inventory/qaQc/ProductionController");
const authMiddleware = require("../../middleware/authMiddleware");

// List by user_id
router.get(
  "/qc-allproduction",
  ProductionController.getQcbatchesWithProduction
);

router.get("/all-production", ProductionController.getAllProductionResults);
router.post("/add-Production", ProductionController.ProductionaddResult);
router.post(
  "/edit-Production",
  authMiddleware,
  ProductionController.ProductionUpdateResult
);

router.post("/add-finishing-entry", ProductionController.createFinishingEntry);
router.put(
  "/update-finishing-entry/:id",
  ProductionController.updateFinishingEntry
);

// router.delete("/delete-dispatch/:id", DispatchVehicleController.deleteDispatchVehicle);
module.exports = router;
