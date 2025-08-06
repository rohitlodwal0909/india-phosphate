const express = require("express");
const router = express.Router();
const CurrencyController = require("../../controllers/master/Currency/CurrencyController");

router.post("/create-currency", CurrencyController.create);
router.get("/get-currency", CurrencyController.findAll);
router.get("/view-currency/:id", CurrencyController.findOne);
router.put("/update-currency/:id", CurrencyController.update);
router.delete("/delete-currency/:id", CurrencyController.delete);

module.exports = router;