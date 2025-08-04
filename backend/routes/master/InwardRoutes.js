// routes/InwardRoutes.js
const express = require("express");
const router = express.Router();
const InwardController = require("../../controllers/master/Inward/InwardController");


router.post("/store-inward", InwardController.createInward);
router.get("/get-inward", InwardController.getAllInward);
router.get("/view-inward/:id", InwardController.getInwardById);
router.put("/update-inward/:id", InwardController.updateInward);
router.delete("/delete-inward/:id", InwardController.deleteInward);


module.exports = router;