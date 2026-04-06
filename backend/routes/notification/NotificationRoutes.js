const express = require("express");
const router = express.Router();

const NotificationController = require("../../controllers/notification/NotificationController");

router.get("/get-all-notification", NotificationController.getAllNotification);
router.get("/total-notification", NotificationController.getTotalNotification);
router.get("/read-notification/:id", NotificationController.readNotification);

module.exports = router;
