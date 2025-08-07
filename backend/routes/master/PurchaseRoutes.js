// routes/outward.js
const express = require("express");
const router = express.Router();
const PurchaseController = require("../../controllers/master/Purchase/PurchaseController");

router.post("/create-purchase", PurchaseController.createPurchase);
router.get("/get-purchase", PurchaseController.getAllPurchase);
router.get("/view-purchase/:id", PurchaseController.getPurchaseById);
router.put("/update-purchase/:id", PurchaseController.updatePurchase);
router.delete("/delete-purchase/:id", PurchaseController.deletePurchase);

module.exports = router;