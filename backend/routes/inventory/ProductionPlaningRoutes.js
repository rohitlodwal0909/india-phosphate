const express = require("express");
const router = express.Router();
const ProductionPlaningController = require("../../controllers/inventory/productionPlaning/ProductionPlaningController");

// List by user_id
router.get("/get-production-planning", ProductionPlaningController.index);

router.post("/create-production-planing", ProductionPlaningController.create);

router.put(
  "/update-production-planing/:id",
  ProductionPlaningController.update
);

router.delete(
  "/delete-production-planning/:id",
  ProductionPlaningController.delete
);

module.exports = router;
