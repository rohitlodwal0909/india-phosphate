// routes/UnitRoutes.js
const express = require("express");
const router = express.Router();
const UnitController = require("../../controllers/master/Unit/UnitController");


router.post("/store-unit", UnitController.createUnit);
router.get("/get-unit", UnitController.getAllUnit);
router.get("/view-unit/:id", UnitController.getUnitById);
router.put("/update-unit/:id", UnitController.updateUnit);
router.delete("/delete-unit/:id", UnitController.deleteUnit);


module.exports = router;