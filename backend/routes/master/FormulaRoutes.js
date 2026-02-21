// routes/FormulaRoutes.js
const express = require("express");
const router = express.Router();
const FormulaController = require("../../controllers/master/Formula/FormulaController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/store-formula", authMiddleware, FormulaController.createFormula);
router.post(
  "/create-specification",
  authMiddleware,
  FormulaController.createSpecification
);

router.get("/get-formula", authMiddleware, FormulaController.getAllFormula);

router.get(
  "/getSpecificationById/:id",
  authMiddleware,
  FormulaController.getSpecificationById
);

router.get(
  "/view-formula/:id",
  authMiddleware,
  FormulaController.getFormulaById
);
router.put(
  "/update-formula/:id",
  authMiddleware,
  FormulaController.updateFormula
);

router.delete(
  "/delete-formula/:id",
  authMiddleware,
  FormulaController.deleteFormula
);

module.exports = router;
