const express = require("express");
const router = express.Router();
const InvoiceController = require("../../controllers/account/invoice/InvoiceController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eway/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// List by user_id
router.get("/get-invoice-entry", InvoiceController.getEntryInvoice);

router.get("/get-invoice/:id", InvoiceController.getInvoice);

router.post("/create-invoice", InvoiceController.createInvoice);

router.put("/update-invoice/:id", InvoiceController.updateInvoice);

router.get("/get-invoices", InvoiceController.getInvoices);

router.post(
  "/upload-eway",
  upload.single("eway_pdf"),
  InvoiceController.uploadEwayPdf
);

module.exports = router;
