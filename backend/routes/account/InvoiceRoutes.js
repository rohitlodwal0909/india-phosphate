const express = require("express");
const router = express.Router();
const InvoiceController = require("../../controllers/account/invoice/InvoiceController");
const GstController = require("../../controllers/account/invoice/GstController");
const multer = require("multer");
const path = require("path");

/* ================= EWAY UPLOAD ================= */

const ewayStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eway/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadEway = multer({
  storage: ewayStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* ================= OQ UPLOAD ================= */

const oqStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/oq-uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadOQ = multer({
  storage: oqStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* ================= ROUTES ================= */

// List
router.get("/get-invoice-entry", InvoiceController.getEntryInvoice);
router.get("/get-dispatch-po", InvoiceController.getDispatchPo);

router.get("/get-invoice/:id", InvoiceController.getInvoice);
router.get("/get-invoices", InvoiceController.getInvoices);

router.get("/get-dispatch-batches", InvoiceController.getDispatchBatches);

//Account Payment

router.get("/get-invoice-payment", InvoiceController.getInvoicepayment);

router.post("/get-gstdetails", GstController.getGstData);

// Create Invoice + OQ Upload
router.post(
  "/create-invoice",
  uploadOQ.single("oq_upload"),
  InvoiceController.createInvoice
);

// Update
router.put(
  "/update-invoice/:id",
  uploadOQ.single("oq_upload"),
  InvoiceController.updateInvoice
);

// Upload Eway PDF
router.post(
  "/upload-eway",
  uploadEway.single("eway_pdf"),
  InvoiceController.uploadEwayPdf
);

module.exports = router;
