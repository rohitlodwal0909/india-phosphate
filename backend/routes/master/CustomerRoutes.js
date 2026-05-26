// routes/CustomerRoutes.js
const express = require("express");
const router = express.Router();
const CustomerController = require("../../controllers/master/Customer/CustomerController");
const PotentialopportunityController = require("../../controllers/master/Customer/PotentialopportunityController");

router.post("/store-customer", CustomerController.createCustomer);
router.get("/get-customer", CustomerController.getCustomers);
router.get("/get-existing-customer", CustomerController.getExistingCustomers);

router.get("/view-customer/:id", CustomerController.getCustomerById);

router.get("/get-products-po/:id", CustomerController.getProductsWithPo);

router.put("/update-customer/:id", CustomerController.updateCustomer);
router.post("/add-note", CustomerController.addNote);
router.delete("/delete-customer/:id", CustomerController.deleteCustomer);
// Customer Journey

router.get("/customer-journey-data/:id", CustomerController.customerJourney);

// Potential Oppertunity

router.post(
  "/store-potential-oppertunity",
  PotentialopportunityController.createOpportunity
);

router.get(
  "/get-potential-oppertunity",
  PotentialopportunityController.getOpportunity
);

router.put(
  "/update-potential-oppertunity/:id",
  PotentialopportunityController.updateOpportunity
);

router.post("/add-potential-note", PotentialopportunityController.addNote);

module.exports = router;
