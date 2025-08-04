// routes/DesignationRoutes.js
const express = require("express");
const router = express.Router();
const DesignationController = require("../../controllers/master/Designation/DesignationController");


router.post("/store-designation", DesignationController.createDesignation);
router.get("/get-designation", DesignationController.getAllDesignation);
router.get("/view-designation/:id", DesignationController.getDesignationById);
router.put("/update-designation/:id", DesignationController.updateDesignation);
router.delete("/delete-dsesignation/:id", DesignationController.deleteDesignation);


module.exports = router;