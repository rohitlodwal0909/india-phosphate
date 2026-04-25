const express = require("express");
const router = express.Router();
const qaQcController = require("../../controllers/inventory/qaQc/QaQcController");

// List by user_id
router.put("/approvedOrRejected/:id", qaQcController.approveOrRejectGrnEntry);
router.get("/raw-material/:id/:qcId/:status", qaQcController.getRawmaterial);
router.get("/all-raw-material", qaQcController.getAllRawMaterials);
router.get("/get-qc-report/:id", qaQcController.getQcReport);
router.get("/get-test-report/:id", qaQcController.getTestReport);

router.post("/save-report-result", qaQcController.saveReportresult);
router.post("/qc-batch-number", qaQcController.addQcBatch);
router.post("/qc-batch-update", qaQcController.updateQcBatch);
router.get("/report/:qc_id", qaQcController.report);

router.get("/get-product-and-specification/:id", qaQcController.viewQcReport);
router.post("/create-qcReport", qaQcController.createQcReport);

router.delete("/qc-batch/:id", qaQcController.deleteQcBatch);
router.get("/all-qc-batch", qaQcController.getAllQcBatches);
router.get("/get-complete-bmr-finish", qaQcController.getCompleteBmrandFinish);

// QA / QC Approved

router.get("/qc-batch-status/:id", qaQcController.batchStatusChange);
router.post("/qc-add-refrensenumber", qaQcController.addRefrenseNumber);

module.exports = router;
