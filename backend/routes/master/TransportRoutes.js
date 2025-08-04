// routes/TransportRoutes.js
const express = require("express");
const router = express.Router();
const TransportController = require("../../controllers/master/Transport/TransportController");


router.post("/store-transport", TransportController.createTransport);
router.get("/get-transport", TransportController.getAllTransport);
router.get("/view-transport/:id", TransportController.getTransportById);
router.put("/update-transport/:id", TransportController.updateTransport);
router.delete("/delete-transport/:id", TransportController.deleteTransport);


module.exports = router;