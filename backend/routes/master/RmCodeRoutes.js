// routes/RmCodeRoutes.js
const express = require("express");
const router = express.Router();
const RmCodeController = require("../../controllers/master/RmCode/RmCodeController");

router.post("/store-rm-code", RmCodeController.createRmCode);
router.post("/store-row-material", RmCodeController.createRawMaterial);
router.get("/get-rm-code", RmCodeController.getAllRmCode);
router.get("/view-rm-code/:id", RmCodeController.getRmCodeById);
router.put("/update-rm-code/:id", RmCodeController.updateRmCode);
router.delete("/delete-rm-code/:id", RmCodeController.deleteRmCode);
router.delete("/delete-rm-material/:id", RmCodeController.deleteRmMaterial);
module.exports = router;
