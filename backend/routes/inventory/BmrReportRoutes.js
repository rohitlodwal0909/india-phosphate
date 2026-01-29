const express = require("express");
const router = express.Router();
const BmrReportController = require("../../controllers/inventory/bmr/BmrReportController");
const authMiddleware = require("../../middleware/authMiddleware");

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
  BmrReportController.savePMIssuence
);

module.exports = router;
