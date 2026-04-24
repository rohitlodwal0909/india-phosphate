const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../../controllers/marketing/PO/PurchaseOrderController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/purchase-orders");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

// Get All Purchase Orders
router.get("/get-purchase-orders", purchaseOrderController.getPurchaseOrders);
router.get("/get-po-report/:id", purchaseOrderController.getPoReport);

router.get("/get-all-customers", purchaseOrderController.getCustomers);

// Store Purchase Order
router.post(
  "/store-purchase-order",
  upload.any(),
  purchaseOrderController.storePurchaseOrder
);

// Update Purchase Order
router.put(
  "/update-purchase-order/:id",
  upload.any(),
  purchaseOrderController.updatePurchaseOrder
);

router.put("/payment-approve/:id", purchaseOrderController.paymentApproved);
router.put("/payment-remark/:id", purchaseOrderController.paymentRemark);

// Delete Purchase Order
router.delete(
  "/delete-purchase-order/:id",
  purchaseOrderController.deletePurchaseOrder
);

router.post("/add-remark", purchaseOrderController.addRemark);
router.post(
  "/work-order/status-update",
  purchaseOrderController.updateWorkOrderStatus
);

module.exports = router;
