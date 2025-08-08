// routes/FormulaRoutes.js
const express = require("express");
const router = express.Router();
const FormulaController = require("../../controllers/master/Formula/FormulaController");


router.post("/store-formula", FormulaController.createFormula);
router.get("/get-formula", FormulaController.getAllFormula);
router.get("/view-formula/:id", FormulaController.getFormulaById);
router.put("/update-formula/:id", FormulaController.updateFormula);
router.delete("/delete-formula/:id", FormulaController.deleteFormula);


module.exports = router;