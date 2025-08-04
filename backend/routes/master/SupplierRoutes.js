// routes/SupplierRoutes.js
const express = require("express");
const router = express.Router();
const SupplierController = require("../../controllers/master/Supplier/SupplierController");


router.post("/store-supplier", SupplierController.createSupplier);
router.get("/get-supplier", SupplierController.getAllSupplier);
router.get("/view-supplier/:id", SupplierController.getSupplierById);
router.put("/update-supplier/:id", SupplierController.updateSupplier);
router.delete("/delete-supplier/:id", SupplierController.deleteSupplier);


module.exports = router;