const express = require("express");
const router = express.Router();
const MeetingController = require("../../controllers/marketing/Meeting/MeetingController");

// Get All Purchase Orders
router.get("/get-meeting", MeetingController.getMeeting);

// Store Purchase Order
router.post("/create-meeting", MeetingController.storeMeeting);

// Update Purchase Order
router.put("/update-meeting/:id", MeetingController.updateMeeting);

router.put("/complete-meeting/:id", MeetingController.completeMeeting);

// Delete Purchase Order
router.delete("/delete-meeting/:id", MeetingController.deleteMeeting);

module.exports = router;
