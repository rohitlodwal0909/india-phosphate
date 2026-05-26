// routes/GradeRoutes.js
const express = require("express");
const router = express.Router();
const GradeController = require("../../controllers/master/Grade/GradeController");

router.post("/store-grade", GradeController.createGrade);
router.get("/get-grade", GradeController.getAllGrade);
router.put("/update-grade/:id", GradeController.updateGrade);
router.delete("/delete-grade/:id", GradeController.deleteGrade);

module.exports = router;
