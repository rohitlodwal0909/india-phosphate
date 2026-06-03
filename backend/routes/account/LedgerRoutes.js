const express = require("express");
const router = express.Router();
const LedgerController = require("../../controllers/account/invoice/LedgerController");

router.get("/get-overall-payment", LedgerController.getOverallPayment);
router.get("/get-customer_ledger/:id", LedgerController.getCustomerLedger);

module.exports = router;
