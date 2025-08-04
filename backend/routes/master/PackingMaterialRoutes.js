// routes/PackingMaterialRoutes.js
const express = require("express");
const router = express.Router();
const PackingMaterialController = require("../../controllers/master/PackingMaterial/PackingMaterialController");


router.post("/store-packing-material", PackingMaterialController.createPackingMaterial);
router.get("/get-packing-material", PackingMaterialController.getAllPackingMaterial);
router.get("/view-packing-material/:id", PackingMaterialController.getPackingMaterialById);
router.put("/update-packing-material/:id", PackingMaterialController.updatePackingMaterial);
router.delete("/delete-packing-material/:id", PackingMaterialController.deletePackingMaterial);


module.exports = router;