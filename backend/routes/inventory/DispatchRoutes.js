const express = require("express");
const router = express.Router();
const DispatchVehicleController = require("../../controllers/inventory/vehicleDispatch/DispatchVehicleController");

// List by user_id
router.put( "/update-dispatch/:id", DispatchVehicleController.updateDispatchVehicle);
router.get("/all-dispatch", DispatchVehicleController.getAllDispatchVehicles);
router.post("/add-dispatch", DispatchVehicleController.dispatchvehicleEntry);

router.delete("/delete-dispatch/:id", DispatchVehicleController.deleteDispatchVehicle);
module.exports = router;
