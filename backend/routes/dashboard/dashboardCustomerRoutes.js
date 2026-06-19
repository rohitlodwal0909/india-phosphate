const express = require("express");
const router = express.Router();
const dashboardCustomerController = require("../../controllers/dashboard/dashboardCustomerController");
const employeeController = require("../../controllers/dashboard/EmployeeDashboardController");

// List by user_id
router.get("/get-total-customers", dashboardCustomerController.getallCustomers);

router.get(
  "/get-customer-data/:id",
  dashboardCustomerController.getCustomerDashboard
);

// Employee
router.get("/get-employee-data/:id", employeeController.getEmployeeDashboard);
router.get("/get-pending-task/:id", employeeController.getPendingTask);
router.get("/get-remaining-task/:id", employeeController.getRemainingTask);

router.get(
  "/get-dormant-customers",
  dashboardCustomerController.getDormantCustomer
);

router.get("/get-pending-orders", dashboardCustomerController.getPendingOrder);
module.exports = router;
