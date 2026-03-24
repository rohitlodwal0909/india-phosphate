const express = require("express");
const router = express.Router();
const ReplacementController = require("../../controllers/inventory/replacement/ReplacementController");

router.get("/get-replacement", ReplacementController.index);
router.post("/add-replacement", ReplacementController.store);

module.exports = router;
