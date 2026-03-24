// routes/CustomerRoutes.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../controllers/master/Customer/CustomerController");

router.post("/store-customer", CustomerController.createCustomer);
router.get("/get-customer", CustomerController.getCustomers);
router.get("/get-existing-customer", CustomerController.getExistingCustomers);

router.get("/view-customer/:id", CustomerController.getCustomerById);

router.get("/get-products-po/:id", CustomerController.getProductsWithPo);

router.put("/update-customer/:id", CustomerController.updateCustomer);
router.post("/add-note", CustomerController.addNote);
router.delete("/delete-customer/:id", CustomerController.deleteCustomer);

module.exports = router;
