// routes/BatchMasterRoutes.js
const express = require("express");
const router = express.Router();
const BatchMasterController = require("../../controllers/master/BatchMaster/BatchMasterController");


router.post("/store-batch-master", BatchMasterController.createBatchMaster);
router.get("/get-batch-master", BatchMasterController.getAllBatchMaster);
router.get("/view-batch-master/:id", BatchMasterController.getBatchMasterById);
router.put("/update-batch-master/:id", BatchMasterController.updateBatchMaster);
router.delete("/delete-batch-master/:id", BatchMasterController.deleteBatchMaster);

module.exports = router;