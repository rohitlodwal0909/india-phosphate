const express = require("express");
const router = express.Router();
const IssuedController = require("../../controllers/inventory/inventoryIssued/InventoryIssuedController");
const IssuedRMController = require("../../controllers/inventory/inventoryIssued/InventoryRMIssuedController");
const PMController = require("../../controllers/inventory/inventoryIssued/PMIssuedController");
const FMIssuedController = require("../../controllers/inventory/inventoryIssued/FMIssuedController");
const authMiddleware = require("../../middleware/authMiddleware");

// List by user_id
router.get("/get-store-equipment", IssuedController.getStoreEquipment);
router.post("/issued-equipment", IssuedController.saveIssuedEquipment);
router.get("/get-issued-equipment", IssuedController.getIssuedEquipment);
router.delete(
  "/issued-delete-equipment/:id",
  IssuedController.deleteIssuedEquipment
);
router.post("/update-issued-equipment", IssuedController.updateIssuedEquipment);
router.post(
  "/return-equipment",
  authMiddleware,
  IssuedController.returnEquipment
);

// RM Issued Routes
router.get("/get-store-rm", IssuedRMController.getStoreRM);
router.post("/issued-raw-material", IssuedRMController.saveIssuedRM);
router.get("/get-issued-raw-material", IssuedRMController.getIssuedRM);
router.delete("/issued-delete-rm/:id", IssuedRMController.deleteIssuedRM);
router.post("/update-issued-rm", IssuedRMController.updateIssuedRM);
router.get("/get-issued-batches", IssuedRMController.getBatches);

// PM Issued Routes

router.get("/get-store-pm", PMController.getStorePM);
router.post("/issued-pm", PMController.saveIssuedPM);
router.get("/get-production-batch", PMController.getBatches);
router.get("/get-issued-pm", PMController.getIssuePM);
router.delete("/issued-delete-pm/:id", PMController.deleteIssuedPM);
router.post("/update-issued-pm", PMController.updateIssuedPM);
router.post("/return-pm", authMiddleware, PMController.returnPM);

//

router.get("/issued-fm/batches", FMIssuedController.getBatches);
router.post("/issued-fm", FMIssuedController.saveIssuedFM);
router.get("/get-issued-fm", FMIssuedController.getIssueFM);
router.delete("/delete-issued-fm/:id", FMIssuedController.deleteIssuedFM);
router.post("/update-issued-pm", FMIssuedController.updateIssuedPM);
router.post("/return-pm", authMiddleware, FMIssuedController.returnPM);
router.get("/get-finished-stock", FMIssuedController.getFinishedStock);

router.get("/get-dispatch-batches", FMIssuedController.getDispatchBatch);

module.exports = router;
