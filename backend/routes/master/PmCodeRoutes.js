// routes/RmCodeRoutes.js
const express = require("express");
const router = express.Router();
const PmCodeController = require("../../controllers/master/PmCode/PmCodeController");

router.post("/store-pm-code", PmCodeController.createPmCode);
router.post("/store-pm-raw-material", PmCodeController.createRawMaterial);
router.get("/get-pm-code", PmCodeController.getAllPmCode);
router.get("/view-pm-code/:id", PmCodeController.getPmCodeById);
router.put("/update-pm-code/:id", PmCodeController.updatePmCode);
router.delete("/delete-pm-code/:id", PmCodeController.deletePmCode);
router.get("/get-pm-raw-material/:id", PmCodeController.getPmRawMaterial);

module.exports = router;
