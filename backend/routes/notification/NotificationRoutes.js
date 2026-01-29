const express = require("express");
const router = express.Router();

const NotificationController = require("../../controllers/notification/NotificationController");

router.get(
  "/get-all-notification/:user_id",
  NotificationController.getAllNotification
);
router.get("/read-notification/:id", NotificationController.readNotification);

module.exports = router;
