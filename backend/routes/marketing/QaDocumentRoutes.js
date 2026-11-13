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
  const allowedExtensions = new Set([
    ".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx", ".xls", ".xlsx"
  ]);
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.has(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, PDF, Word, and Excel files are allowed"), false);
  }
};

/* =========================================================
    MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
});

/* =========================================================
    ROUTES
========================================================= */

// Get All QA Documents
router.get("/get-qa-documents", QaDocumentController.getQaDocument);

// Create QA Document
router.post(
  "/create-qa-documents",
  upload.any(),
  QaDocumentController.storeQaDocument
);

// Update QA Document
router.put(
  "/update-qa-documents/:id",
  upload.any(),
  QaDocumentController.updateQaDocument
);

// Delete QA Document
router.delete(
  "/delete-qa-documents/:id",
  QaDocumentController.deleteQaDocument
);

module.exports = router;
