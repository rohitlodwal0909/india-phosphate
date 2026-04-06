const express = require("express");
const router = express.Router();
const PurchaseStore = require("../../controllers/purchase/store/PurchaseStore");

/* ======================================================
   ROUTES
====================================================== */

// ✅ CREATE
router.post("/create-purchase-store", PurchaseStore.create);
router.put("/update-purchase-store", PurchaseStore.update);
router.get("/find-store/:po_id", PurchaseStore.find);

module.exports = router;
