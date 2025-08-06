// routes/StockMasterRoutes.js
const express = require("express");
const router = express.Router();
const StockMasterController = require("../../controllers/master/StockMaster/StockMasterController");


router.post("/store-stock-master", StockMasterController.createStockMaster);
router.get("/get-stock-master", StockMasterController.getAllStockMaster);
router.get("/view-stock-master/:id", StockMasterController.getStockMasterById);
router.put("/update-stock-master/:id", StockMasterController.updateStockMaster);
router.delete("/delete-stock-master/:id", StockMasterController.deleteStockMaster);

module.exports = router;