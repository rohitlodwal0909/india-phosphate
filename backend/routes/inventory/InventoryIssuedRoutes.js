const express = require("express");
const router = express.Router();
const IssuedController = require("../../controllers/inventory/inventoryIssued/InventoryIssuedController");
const IssuedRMController = require("../../controllers/inventory/inventoryIssued/InventoryRMIssuedController");
const PMController = require("../../controllers/inventory/inventoryIssued/PMIssuedController");

// List by user_id
router.get("/get-store-equipment", IssuedController.getStoreEquipment);
router.post("/issued-equipment", IssuedController.saveIssuedEquipment);
router.get("/get-issued-equipment", IssuedController.getIssuedEquipment);
router.delete(
  "/issued-delete-equipment/:id",
  IssuedController.deleteIssuedEquipment
);
router.post("/update-issued-equipment", IssuedController.updateIssuedEquipment);

// RM Issued Routes
router.get("/get-store-rm", IssuedRMController.getStoreRM);
router.post("/issued-raw-material", IssuedRMController.saveIssuedRM);
router.get("/get-issued-raw-material", IssuedRMController.getIssuedRM);
router.delete("/issued-delete-rm/:id", IssuedRMController.deleteIssuedRM);
router.post("/update-issued-rm", IssuedRMController.updateIssuedRM);

// PM Issued Routes

router.get("/get-store-pm", PMController.getStorePM);
router.post("/issued-pm", PMController.saveIssuedPM);
router.get("/get-issued-pm", PMController.getIssuePM);
router.delete("/issued-delete-pm/:id", PMController.deleteIssuedPM);
router.post("/update-issued-pm", PMController.updateIssuedPM);

module.exports = router;
