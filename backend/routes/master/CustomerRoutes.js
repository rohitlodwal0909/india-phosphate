// routes/CustomerRoutes.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../controllers/master/Customer/CustomerController");


router.post("/store-customer", CustomerController.createCustomer);
router.get("/get-customer", CustomerController.getAllCustomer);
router.get("/view-customer/:id", CustomerController.getCustomerById);
router.put("/update-customer/:id", CustomerController.updateCustomer);
router.delete("/delete-customer/:id", CustomerController.deleteCustomer);


module.exports = router;