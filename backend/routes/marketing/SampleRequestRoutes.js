const express = require("express");
const router = express.Router();
const SampleRequestController = require("../../controllers/marketing/Sample/SampleRequestController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
/* ===============================
   Create Upload Folders If Missing
=================================*/

/* ===============================
   File Filter (Security)
=================================*/
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

/* ===============================
   Sample Request Upload
=================================*/
const sampleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sample-request");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: sampleStorage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB upload limit
  }
});

/* ===============================
   QC COA Upload
=================================*/
const coaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/coa_pdf");
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  }
});

const uploadCoa = multer({
  storage: coaStorage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
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
router.put(
  "/update-samplerequest/:id",
  upload.any(),
  SampleRequestController.updateSampleRequest
);

// Delete Sample Request
router.delete(
  "/delete-samplerequest/:id",
  SampleRequestController.deleteSampleRequest
);

// Upload QC COA PDF
router.post(
  "/upload-qc-coa",
  uploadCoa.single("coa_pdf"),
  SampleRequestController.uploadQcCoa
);

module.exports = router;
