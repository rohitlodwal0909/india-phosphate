const express = require("express");
const router = express.Router();
const dashboardCustomerController = require("../../controllers/dashboard/dashboardCustomerController");

// List by user_id
router.get("/get-total-customers", dashboardCustomerController.getallCustomers);

module.exports = router;
