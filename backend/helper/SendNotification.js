const db = require("../models");
const { Notification, User } = db;

const createNotificationByRoleId = async ({ title, message, role_id }) => {
  try {
    if (!role_id) {
      console.warn("❌ role_id is required");
      return;
    }

    const users = await User.findAll({
      where: { role_id },
    });

    if (!users || users.length === 0) {
      console.warn(`❌ No users found with role_id: ${role_id}`);
      return;
    }

    console.log(`✅ Notifying ${users.length} users with role_id ${role_id}`);

    for (const user of users) {
      const notification = await Notification.create({
        user_id: user.id,
        title,
        message,
        is_read: 0,
        date_time: new Date(),
      });

      if (global.io) {
        global.io.to(`user_${user.id}`).emit("new_notification", notification);
      }
    }

    console.log("✅ Notifications sent successfully.");
  } catch (error) {
    console.error("❌ Error in createNotificationByRoleId:", error);
  }
};

module.exports = { createNotificationByRoleId };
