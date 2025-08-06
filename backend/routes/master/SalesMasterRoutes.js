// routes/SalesMasterRoutes.js
const express = require("express");
const router = express.Router();
const SalesMasterController = require("../../controllers/master/SalesMaster/SalesMasterController");


router.post("/store-sales-master", SalesMasterController.createSalesMaster);
router.get("/get-sales-master", SalesMasterController.getAllSalesMaster);
router.get("/view-sales-master/:id", SalesMasterController.getSalesMasterById);
router.put("/update-sales-master/:id", SalesMasterController.updateSalesMaster);
router.delete("/delete-sales-master/:id", SalesMasterController.deleteSalesMaster);

module.exports = router;