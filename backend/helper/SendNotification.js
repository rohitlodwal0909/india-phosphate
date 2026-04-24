const db = require("../models");
const { Notification, RolePermissionModel } = db;
const { getISTDateTime } = require("../helper/dateTimeHelper");

const createNotificationByRoleId = async ({
  title,
  message,
  role_id,
  module_id = null,
  submodule_id = null
}) => {
  try {
    if (!role_id) {
      console.warn("❌ role_id is required");
      return;
    }

    const { entry_date, entry_time } = getISTDateTime();

    /* ----------------------------------
       Dynamic WHERE condition
    ---------------------------------- */
    const whereCondition = { role_id };

    if (module_id !== null) whereCondition.module_id = module_id;
    if (submodule_id !== null) whereCondition.submodule_id = submodule_id;

    /* ----------------------------------
       Get Users
    ---------------------------------- */
    const permissions = await RolePermissionModel.findAll({
      where: whereCondition,
      attributes: ["user_id"],
      raw: true
    });

    if (!permissions.length) {
      console.warn(`❌ No users found with role_id: ${role_id}`);
      return;
    }

    /* ----------------------------------
       Remove duplicate users
    ---------------------------------- */
    const uniqueUserIds = [...new Set(permissions.map((u) => u.user_id))];

    /* ----------------------------------
       Prepare Notifications
    ---------------------------------- */
    const notificationsData = uniqueUserIds.map((user_id) => ({
      user_id,
      title,
      message,
      is_read: 0,
      date_time: `${entry_date} ${entry_time}`
    }));

    /* ----------------------------------
       Bulk Insert (FAST)
    ---------------------------------- */
    const createdNotifications = await Notification.bulkCreate(
      notificationsData,
      { returning: true }
    );

    /* ----------------------------------
       Socket Emit
    ---------------------------------- */
    if (global.io) {
      createdNotifications.forEach((notification) => {
        global.io
          .to(`user_${notification.user_id}`)
          .emit("new_notification", notification);
      });
    }

    console.log(`✅ Notifications sent to ${uniqueUserIds.length} users`);
  } catch (error) {
    console.error("❌ Error in createNotificationByRoleId:", error);
  }
};

module.exports = { createNotificationByRoleId };
