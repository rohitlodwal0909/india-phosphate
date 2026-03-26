const express = require("express");
const router = express.Router();
const InvoiceController1 = require("../../controllers/account/invoice/ExportInvoiceController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/export-invoice/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post(
  "/upload-export-invoice",
  upload.single("excel"),
  InvoiceController1.exportInvoiceUpload
);

router.put(
  "/update-export-invoice/:id",
  upload.single("excel"),
  InvoiceController1.exportInvoiceUpdate
);

router.get("/get-excel-invoice", InvoiceController1.getExcelInvoice);

router.delete(
  "/delete-export-invoice/:id",
  InvoiceController1.deleteExportInvoice
);

module.exports = router;
