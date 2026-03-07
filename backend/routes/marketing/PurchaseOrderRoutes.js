const express = require("express");
const router = express.Router();

const purchaseOrderController = require("../../controllers/marketing/PO/PurchaseOrderController");

// Get All Purchase Orders
router.get("/get-purchase-orders", purchaseOrderController.getPurchaseOrders);

// Store Purchase Order
router.post(
  "/store-purchase-order",
  purchaseOrderController.storePurchaseOrder
);

// Update Purchase Order
router.put(
  "/update-purchase-order/:id",
  purchaseOrderController.updatePurchaseOrder
);

// Delete Purchase Order
router.delete(
  "/delete-purchase-order/:id",
  purchaseOrderController.deletePurchaseOrder
);

router.post("/create-work-order-no", purchaseOrderController.createWorkOrderNo);

router.post("/add-remark", purchaseOrderController.addRemark);
router.post(
  "/work-order/status-update",
  purchaseOrderController.updateWorkOrderStatus
);

module.exports = router;
