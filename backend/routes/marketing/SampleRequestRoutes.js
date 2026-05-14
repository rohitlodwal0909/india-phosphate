const express = require("express");
const router = express.Router();
const SampleRequestController = require("../../controllers/marketing/Sample/SampleRequestController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/sample-request");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

// Get All Purchase Orders
router.get("/get-samplerequest", SampleRequestController.getSampleRequest);

// Store Purchase Order
router.post(
  "/store-samplerequest",
  upload.any(),
  SampleRequestController.storeSampleRequest
);

// Update Purchase Order
router.put(
  "/update-samplerequest/:id",
  upload.any(),
  SampleRequestController.updatePurchaseOrder
);

// Delete Purchase Order
router.delete(
  "/delete-samplerequest/:id",
  SampleRequestController.deletePurchaseOrder
);

module.exports = router;
