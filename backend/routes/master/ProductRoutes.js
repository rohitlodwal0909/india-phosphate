// routes/UnitRoutes.js
const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/master/Product/ProductController");

router.post("/store-product", ProductController.createProduct);
router.get("/get-product", ProductController.getAllProduct);
router.put("/update-product/:id", ProductController.updateProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);

module.exports = router;
