const express = require("express");
const router = express.Router();
const BmrRecordsController = require("../../controllers/inventory/bmr/BmrRecordController");

// List by user_id
router.post("/save-bmr-record", BmrRecordsController.store);
router.get("/get-bmr-records", BmrRecordsController.index);
router.delete("/delete-bmr-record/:id", BmrRecordsController.destroy);
router.put("/update-bmr-record/:id", BmrRecordsController.update);
router.get(
  "/get-line-clearance/:bmr_id",
  BmrRecordsController.getLineClearanceByBmr
);
router.put(
  "/update-bmr-line-clearance/:id",
  BmrRecordsController.updateLineClearance
);
//  Line CLearance

module.exports = router;
