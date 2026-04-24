const express = require("express");
const router = express.Router();
const PoPurchaseController = require("../../controllers/purchase/popurchase/PoPurchaseController");

/* ======================================================
   ROUTES
====================================================== */

router.post("/create-purchasepo", PoPurchaseController.createPoPurchase);
router.put("/update-purchasepo/:id", PoPurchaseController.updatePoRequisition);
router.get("/get-purchasepo", PoPurchaseController.getPurchasePo);

router.delete(
  "/delete-purchasepo/:id",
  PoPurchaseController.deletePoRequisition
);

module.exports = router;
