const db = require("../../models");
const { Notification, User } = db;

exports.getAllNotification = async (req, res, next) => {
  try {
    const user_id = req.admin.id; // ✅ Get user_id from route parameter

    if (!user_id) {
      const error = new Error("user_id is required");
      error.status = 400;
      return next(error);
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const notifications = await Notification.findAll({
      where: { user_id },
      order: [["date_time", "DESC"]]
    });

    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.getTotalNotification = async (req, res, next) => {
  try {
    const user_id = req.admin.id;

    if (!user_id) {
      const error = new Error("user_id is required");
      error.status = 400;
      return next(error);
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    // ✅ COUNT QUERY
    const totalNotifications = await Notification.count({
      where: { user_id, is_read: 0 }
    });

    return res.status(200).json(totalNotifications);
  } catch (error) {
    next(error);
  }
};

exports.readNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      const error = new Error("Notification not found");
      error.status = 404;
      return next(error);
    }

    notification.is_read = 1;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};
