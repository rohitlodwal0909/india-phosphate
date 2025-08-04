// routes/QualificationRoutes.js
const express = require("express");
const router = express.Router();
const QualificationController = require("../../controllers/master/Qualification/QualificationController");


router.post("/store-qualification", QualificationController.createQualification);
router.get("/get-qualification", QualificationController.getAllQualification);
router.get("/view-qualification/:id", QualificationController.getQualificationById);
router.put("/update-qualification/:id", QualificationController.updateQualification);
router.delete("/delete-qualification/:id", QualificationController.deleteQualification);


module.exports = router;