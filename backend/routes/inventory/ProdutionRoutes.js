const express = require("express");
const router = express.Router();
const ProductionController = require("../../controllers/inventory/qaQc/ProductionController");

// List by user_id
router.get( "/api/qc-allproduction", ProductionController.getQcbatchesWithProduction);

router.get("/api/all-production", ProductionController.getAllProductionResults);
router.post("/api/add-Production", ProductionController.ProductionaddResult);

router.post("/api/add-finishing-entry", ProductionController.createFinishingEntry);
router.put("/api/update-finishing-entry/:id", ProductionController.updateFinishingEntry);

// router.delete("/api/delete-dispatch/:id", DispatchVehicleController.deleteDispatchVehicle);
module.exports = router;
