const express = require("express");
const router = express.Router();
const InvoiceController = require("../../controllers/account/invoice/InvoiceController");
const BillController = require("../../controllers/account/invoice/BillController");
const multer = require("multer");
const path = require("path");

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
router.get("/get-bills", BillController.getBills);

router.get("/get-bill/:id", BillController.getSingleBill);
router.get("/get-invoices", InvoiceController.getInvoices);

// Create Invoice + OQ Upload
router.post(
  "/create-bill",
  uploadOQ.single("oq_upload"),
  BillController.createBill
);

// Update
router.put(
  "/update-bill/:id",
  uploadOQ.single("oq_upload"),
  BillController.updateBill
);

module.exports = router;
