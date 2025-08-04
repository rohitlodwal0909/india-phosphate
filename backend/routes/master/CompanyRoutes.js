// routes/CompanyRoutes.js
const express = require("express");
const router = express.Router();
const CompanyController = require("../../controllers/master/Company/CompanyController");


router.post("/store-company", CompanyController.createCompany);
router.get("/get-company", CompanyController.getAllCompany);
router.get("/view-company/:id", CompanyController.getCompanyById);
router.put("/update-company/:id", CompanyController.updateCompany);
router.delete("/delete-company/:id", CompanyController.deleteCompany);


module.exports = router;