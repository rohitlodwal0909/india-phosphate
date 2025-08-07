const express = require("express");
const router = express.Router();
const BmrMasterController = require("../../controllers/master/BmrMaster/BmrMasterController");

router.post("/create-bmr", BmrMasterController.create);
router.get("/get-bmr", BmrMasterController.findAll);
router.get("/view-bmr/:id", BmrMasterController.findOne);
router.put("/update-bmr/:id", BmrMasterController.update);
router.delete("/delete-bmr/:id", BmrMasterController.delete);

module.exports = router;