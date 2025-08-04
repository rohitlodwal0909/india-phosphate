// routes/StateRoutes.js
const express = require("express");
const router = express.Router();
const StateController = require("../../controllers/master/State/StateController");


router.post("/store-state", StateController.createState);
router.get("/get-state", StateController.getAllState);
router.get("/view-state/:id", StateController.getStateById);
router.put("/update-state/:id", StateController.updateState);
router.delete("/delete-state/:id", StateController.deleteState);


module.exports = router;