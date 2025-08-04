// routes/CityRoutes.js
const express = require("express");
const router = express.Router();
const CityController = require("../../controllers/master/City/CityController");


router.post("/store-city", CityController.createCity);
router.get("/get-city", CityController.getAllCity);
router.get("/view-city/:id", CityController.getCityById);
router.put("/update-city/:id", CityController.updateCity);
router.delete("/delete-city/:id", CityController.deleteCity);


module.exports = router;