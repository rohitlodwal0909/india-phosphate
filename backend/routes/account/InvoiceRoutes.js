const express = require("express");
const router = express.Router();
const InvoiceController = require("../../controllers/account/invoice/invoiceController");

// List by user_id
router.get("/get-invoice-entry", InvoiceController.getEntryInvoice);

module.exports = router;
