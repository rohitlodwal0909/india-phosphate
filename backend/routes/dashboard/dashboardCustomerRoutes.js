const express = require("express");
const router = express.Router();
const dashboardCustomerController = require("../../controllers/dashboard/dashboardCustomerController");

// List by user_id
router.get("/get-total-customers", dashboardCustomerController.getallCustomers);
router.get(
  "/get-employee-data/:id",
  dashboardCustomerController.getEmployeeDashboard
);

module.exports = router;
