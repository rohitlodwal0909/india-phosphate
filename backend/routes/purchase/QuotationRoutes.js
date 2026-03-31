const express = require("express");
const router = express.Router();
const Quotation = require("../../controllers/purchase/quotation/QuotationController");

/* ======================================================
   ROUTES
====================================================== */

// ✅ CREATE
router.post("/create-quotation", Quotation.createQuotation);

// ✅ UPDATE
router.put("/update-quotation/:id", Quotation.updateQuotation);

// ✅ GET ALL
router.get("/get-quotation", Quotation.getQuotation);

// ✅ DELETE
router.delete("/delete-quotation/:id", Quotation.deleteQuotation);

module.exports = router;
