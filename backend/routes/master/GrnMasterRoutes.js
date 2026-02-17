const express = require("express");
const router = express.Router();
const GrnController = require("../../controllers/master/Grn/GrnController");

router.post("/store-grn", GrnController.create);
router.get("/get-grn", GrnController.findAll);
router.put("/update-grn/:id", GrnController.update);
router.delete("/delete-grn/:id", GrnController.delete);

module.exports = router;
