const express = require("express");
const router = express.Router();
const ProductionController = require("../../controllers/inventory/qaQc/ProductionController");

// List by user_id
router.get( "/qc-allproduction", ProductionController.getQcbatchesWithProduction);

router.get("/all-production", ProductionController.getAllProductionResults);
router.post("/add-Production", ProductionController.ProductionaddResult);

router.post("/add-finishing-entry", ProductionController.createFinishingEntry);
router.put("/update-finishing-entry/:id", ProductionController.updateFinishingEntry);

// router.delete("/delete-dispatch/:id", DispatchVehicleController.deleteDispatchVehicle);
module.exports = router;
