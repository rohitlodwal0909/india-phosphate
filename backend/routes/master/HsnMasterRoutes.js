// routes/MakeMasterRoutes.js
const express = require("express");
const router = express.Router();
const HsnMasterController = require("../../controllers/master/HsnMaster/HsnMasterController");

router.post("/create-hsn", HsnMasterController.create);
router.get("/get-hsn", HsnMasterController.findAll);
router.get("/view-hsn/:id", HsnMasterController.findOne);
router.put("/update-hsn/:id", HsnMasterController.update);
router.delete("/delete-hsn/:id", HsnMasterController.delete);

module.exports = router;