const express = require("express");
const router = express.Router();
const EquipmentController = require("../../controllers/master/Equipment/EquipmentController");

router.post("/create-equipment", EquipmentController.create);
router.get("/get-equipment", EquipmentController.findAll);
router.get("/view-equipment/:id", EquipmentController.findOne);
router.put("/update-equipment/:id", EquipmentController.update);
router.delete("/delete-equipment/:id", EquipmentController.delete);

module.exports = router;