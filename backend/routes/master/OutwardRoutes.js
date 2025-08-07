// routes/outward.js
const express = require("express");
const router = express.Router();
const OutwardController = require("../../controllers/master/Outword/OutwordController");

router.post("/create-outward", OutwardController.createOutward);
router.get("/get-outward", OutwardController.getAllOutward);
router.get("/view-outward/:id", OutwardController.getOutwardById);
router.put("/update-outward/:id", OutwardController.updateOutward);
router.delete("/delete-outward/:id", OutwardController.deleteOutward);

module.exports = router;