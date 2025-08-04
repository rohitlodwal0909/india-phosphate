// routes/CategoryRoutes.js
const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/master/Category/CategoryController");


router.post("/store-category", CategoryController.createCategory);
router.get("/get-category", CategoryController.getAllCategory);
router.get("/view-category/:id", CategoryController.getCategoryById);
router.put("/update-category/:id", CategoryController.updateCategory);
router.delete("/delete-category/:id", CategoryController.deleteCategory);


module.exports = router;