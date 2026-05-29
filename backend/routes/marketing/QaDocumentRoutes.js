const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const QaDocumentController = require("../../controllers/marketing/QaDocument/QaDocumentController");

/* =========================================================
    MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/qa-documents");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* =========================================================
    FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

/* =========================================================
    MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter
});

/* =========================================================
    ROUTES
========================================================= */

// Get All QA Documents
router.get("/get-qa-documents", QaDocumentController.getQaDocument);

// Create QA Document
router.post(
  "/create-qa-documents",
  upload.array("files"),
  QaDocumentController.storeQaDocument
);

// Update QA Document
router.put(
  "/update-qa-documents/:id",
  upload.array("files"),
  QaDocumentController.updateQaDocument
);

// Delete QA Document
router.delete(
  "/delete-qa-documents/:id",
  QaDocumentController.deleteQaDocument
);

module.exports = router;
