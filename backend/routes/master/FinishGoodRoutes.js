// routes/FinishGoodRoutes.js
const express = require("express");
const router = express.Router();
const FinishGoodController = require("../../controllers/master/FinishGood/FinishGoodController");


router.post("/store-finish-good", FinishGoodController.createFinishGood);
router.get("/get-finish-good", FinishGoodController.getAllFinishGood);
router.get("/view-finish-good/:id", FinishGoodController.getFinishGoodById);
router.put("/update-finish-good/:id", FinishGoodController.updateFinishGood);
router.delete("/delete-finish-good/:id", FinishGoodController.deleteFinishGood);


module.exports = router;