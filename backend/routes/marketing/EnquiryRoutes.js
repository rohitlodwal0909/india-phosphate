const express = require("express");
const router = express.Router();
const EnquiryController = require("../../controllers/marketing/Enquiry/EnquiryController");

// Get All Purchase Orders
router.get("/get-enquiry", EnquiryController.getEnquiries);

// Store Purchase Order
router.post("/store-enquiry", EnquiryController.storeEnquiry);

// Update Purchase Order
router.put("/update-enquiry/:id", EnquiryController.updateEnquiry);

// Delete Purchase Order
router.delete("/delete-enquiry/:id", EnquiryController.deleteEnquiry);

module.exports = router;
