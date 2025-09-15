const express = require("express");
const router = express.Router();
const qaQcController = require("../../controllers/inventory/qaQc/QaQcController");

// List by user_id
router.put("/approvedOrRejected/:id", qaQcController.approveOrRejectGrnEntry);
router.get("/raw-material/:id", qaQcController.getRawmaterial);
router.get("/all-raw-material", qaQcController.getAllRawMaterials);

router.post("/save-report-result", qaQcController.saveReportresult);
router.post("/qc-batch-number", qaQcController.addQcBatch);
router.get("/report/:qc_id", qaQcController.report);
router.delete("/qc-batch/:id", qaQcController.deleteQcBatch);
router.get("/all-qc-batch", qaQcController.getAllQcBatches);

// QA / QC Approved

router.get("/qc-batch-status/:id", qaQcController.batchStatusChange);
router.post("/qc-add-refrensenumber", qaQcController.addRefrenseNumber);

module.exports = router;
