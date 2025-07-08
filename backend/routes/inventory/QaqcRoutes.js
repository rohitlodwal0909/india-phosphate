const express = require("express");
const router = express.Router();
const qaQcController = require("../../controllers/inventory/qaQc/QaQcController");

// List by user_id
router.put(
  "/api/approvedOrRejected/:id",
  qaQcController.approveOrRejectGrnEntry
);
router.get("/api/raw-material/:id", qaQcController.getRawmaterial);
router.get("/api/all-raw-material", qaQcController.getAllRawMaterials);

router.post("/api/save-report-result", qaQcController.saveReportresult);
router.post("/api/qc-batch-number", qaQcController.addQcBatch);
router.get("/api/report/:qc_id", qaQcController.report);
router.delete("/api/qc-batch/:id", qaQcController.deleteQcBatch);
router.get("/api/all-qc-batch", qaQcController.getAllQcBatches);
module.exports = router;
