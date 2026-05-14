const express = require("express");
const router = express.Router();
const SampleRequestController = require("../../controllers/marketing/Sample/SampleRequestController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ===============================
   Create Upload Folders If Missing
=================================*/
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

createFolder("uploads/sample-request");
createFolder("uploads/coa_pdf");

/* ===============================
   Sample Request File Upload
=================================*/
const sampleStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/sample-request");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: sampleStorage
});

/* ===============================
   QC COA Upload
=================================*/
const coaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/coa_pdf");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const uploadCoa = multer({
  storage: coaStorage
});

/* ===============================
   Routes
=================================*/

// Get All Sample Requests
router.get("/get-samplerequest", SampleRequestController.getSampleRequest);

// Store Sample Request
router.post(
  "/store-samplerequest",
  upload.any(),
  SampleRequestController.storeSampleRequest
);

// Update Sample Request
// router.put(
//   "/update-samplerequest/:id",
//   upload.any(),
//   SampleRequestController.updateSampleRequest
// );

// Delete Sample Request
// router.delete(
//   "/delete-samplerequest/:id",
//   SampleRequestController.deleteSampleRequest
// );

// Upload QC COA PDF
router.post(
  "/upload-qc-coa",
  uploadCoa.single("coa_pdf"),
  SampleRequestController.uploadQcCoa
);

module.exports = router;
