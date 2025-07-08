
const db = require("../../models");
const { Notification,User } = db;

exports.getAllNotification = async (req, res) => {
  try {
    const { user_id } = req.params; // ✅ Get user_id from route parameter

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let notifications = [];

    // ✅ If super admin, return all notifications
    if (user.role_id === 1) {
      notifications = await Notification.findAll({
    order: [['date_time', 'DESC']],
  });
    } else {
      // ✅ Otherwise, return only that user's notifications
      notifications = await Notification.findAll({
        where: { user_id },
         order: [['date_time', 'DESC']],
      });
    }

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error in getAllNotification:", error);
    return res.status(500).json({ error: error.message });
  }
};


exports.readNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.is_read = 1;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};