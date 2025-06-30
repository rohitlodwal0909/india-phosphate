const express = require("express");
const router = express.Router();
const DispatchVehicleController = require("../../controllers/inventory/vehicleDispatch/DispatchVehicleController");

// List by user_id
router.put( "/api/update-dispatch/:id", DispatchVehicleController.updateDispatchVehicle);
router.get("/api/all-dispatch", DispatchVehicleController.getAllDispatchVehicles);
router.post("/api/add-dispatch", DispatchVehicleController.dispatchvehicleEntry);

router.delete("/api/delete-dispatch/:id", DispatchVehicleController.deleteDispatchVehicle);
module.exports = router;
