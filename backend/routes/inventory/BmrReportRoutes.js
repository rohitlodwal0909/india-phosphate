const express = require("express");
const router = express.Router();
const BmrReportController = require("../../controllers/inventory/bmr/BmrReportController");
const authMiddleware = require("../../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadPath = path.join(__dirname, "../../../uploads/pm-issuance");

// ✅ Folder auto create if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const uploadPM = multer({ storage }).any();

router.get("/get-production-batch/:id", BmrReportController.index);
router.get("/get-bmr-report/:id", BmrReportController.getbmrReport);

router.post(
  "/save-bmr-line-clearance",
  authMiddleware,
  BmrReportController.saveLineClearance
);
router.post(
  "/save-bmr-dispensing-raw-material",
  authMiddleware,
  BmrReportController.saveDispensingRawMaterial
);

router.post(
  "/save-bmr-equipment-list",
  authMiddleware,
  BmrReportController.saveEquipmentList
);

router.post(
  "/save-sieve-integrity-record",
  authMiddleware,
  BmrReportController.saveSieveIntegrityRecord
);

router.post(
  "/save-filter-cloth-record",
  authMiddleware,
  BmrReportController.saveFilterClothRecord
);

router.post(
  "/save-inprocess-check",
  authMiddleware,
  BmrReportController.createInprocessCheck
);

router.post(
  "/save-qc-intimation",
  authMiddleware,
  BmrReportController.saveQCintimation
);

router.post(
  "/save-pm-issuence",
  authMiddleware,
  uploadPM,
  BmrReportController.savePMIssuence
);

router.post(
  "/save-packing-record",
  authMiddleware,
  BmrReportController.savePackingRecord
);

router.post(
  "/save-yield-calculation",
  authMiddleware,
  BmrReportController.saveYieldCalculation
);

router.post(
  "/save-production-review",
  authMiddleware,
  BmrReportController.saveProductionReview
);

router.post(
  "/save-product-release",
  authMiddleware,
  BmrReportController.saveProductRelease
);

router.post(
  "/save-manufacturing-procedure",
  authMiddleware,
  BmrReportController.saveManufacturingProcedure
);

router.post(
  "/save-line-clearance-processing",
  authMiddleware,
  BmrReportController.saveLineClearanceProcessing
);

module.exports = router;
