// routes/PendingOrderRoutes.js
const express = require("express");
const router = express.Router();
const PendingOrderController = require("../../controllers/master/PendingOrder/PendingOrderController");


router.post("/store-pending-order", PendingOrderController.createPendingOrder);
router.get("/get-pending-order", PendingOrderController.getAllPendingOrder);
router.get("/view-pending-order/:id", PendingOrderController.getPendingOrderById);
router.put("/update-pending-order/:id", PendingOrderController.updatePendingOrder);
router.delete("/delete-pending-order/:id", PendingOrderController.deletePendingOrder);

module.exports = router;