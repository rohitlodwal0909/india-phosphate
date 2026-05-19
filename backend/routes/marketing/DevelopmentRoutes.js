const express = require("express");
const router = express.Router();
const DevelopmentController = require("../../controllers/marketing/development/DevelopmentController");

// Get All Purchase Orders
router.get("/get-development", DevelopmentController.getDevelopment);

// Store Purchase Order
router.post("/store-development", DevelopmentController.storeDevelopment);

// Update Purchase Order
router.put("/update-development/:id", DevelopmentController.updateDevelopment);

// Delete Purchase Order
router.delete(
  "/delete-development/:id",
  DevelopmentController.deleteDevelopment
);

module.exports = router;
