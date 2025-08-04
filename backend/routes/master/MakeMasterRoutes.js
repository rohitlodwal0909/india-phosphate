// routes/MakeMasterRoutes.js
const express = require("express");
const router = express.Router();
const MakeMasterController = require("../../controllers/master/MakeMaster/MakeMasterController");


router.post("/store-make-master", MakeMasterController.createMakeMaster);
router.get("/get-make-master", MakeMasterController.getAllMakeMaster);
router.get("/view-make-master/:id", MakeMasterController.getMakeMasterById);
router.put("/update-make-master/:id", MakeMasterController.updateMakeMaster);
router.delete("/delete-make-master/:id", MakeMasterController.deleteMakeMaster);


module.exports = router;