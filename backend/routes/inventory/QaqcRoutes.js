const express = require("express");
const router = express.Router();
const qaQcController = require("../../controllers/inventory/qaQc/QaQcController");

// List by user_id
router.put(
  "/api/approvedOrRejected/:id",
  qaQcController.approveOrRejectGrnEntry
);
router.get("/api/raw-material/:id", qaQcController.getRawmaterial);
router.post("/api/save-report-result", qaQcController.saveReportresult);

router.get("/api/report/:qc_id", qaQcController.report);
module.exports = router;
