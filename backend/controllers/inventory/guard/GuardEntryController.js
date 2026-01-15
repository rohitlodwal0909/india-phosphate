const { sequelize } = require("../../../models");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");
const { GuardEntry, User, GrnEntry, PmCode, RmCode } = db;

exports.store = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const {
      user_id,
      name,
      guard_type,
      product_name,
      product_id,
      sender_name,
      vehicle_number,
      remark,
      quantities
    } = req.body;

    const { entry_date, entry_time } = getISTDateTime();

    /* ------------ Validation ------------ */
    if (!user_id || !name || !guard_type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!Array.isArray(quantities) || quantities.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one quantity required" });
    }

    for (const q of quantities) {
      if (!q.quantity_net || !q.quantity_unit) {
        return res.status(400).json({
          message: "Quantity net & unit required"
        });
      }
    }

    /* ------------ Get Last Inward Number ------------ */
    const latestEntry = await GuardEntry.findOne({
      order: [["created_at", "DESC"]],
      transaction: t
    });

    let inwardCounter = 1;
    if (latestEntry?.inward_number) {
      const last = parseInt(latestEntry.inward_number.replace("INW-", ""));
      if (!isNaN(last)) inwardCounter = last + 1;
    }

    /* ------------ Logging ------------ */
    const user = await User.findByPk(user_id, { transaction: t });
    const username = user?.username || "Unknown User";

    /* ------------ CREATE MULTIPLE ROWS WITH MULTIPLE INWARD ------------ */
    const rows = quantities.map((q) => {
      const inward_number = `INW-${String(inwardCounter).padStart(4, "0")}`;
      inwardCounter++; // 🔥 increment inward

      return {
        user_id,
        name,
        guard_type,
        product_name,
        product_id,
        sender_name,
        vehicle_number,
        quantity_net: q.quantity_net,
        quantity_unit: q.quantity_unit,
        inward_number,
        entry_date,
        entry_time,
        remark
      };
    });

    const createdEntries = await GuardEntry.bulkCreate(rows, {
      transaction: t
    });

    await createLogEntry({
      user_id,
      message: `${createdEntries.length} guard entries created by ${username} on ${entry_date} at ${entry_time}`
    });

    await createNotificationByRoleId({
      title: "New Guard Store",
      message: "Multiple inward entries created, store verification required",
      role_id: 2
    });

    await t.commit();

    return res.status(201).json({
      message: `${createdEntries.length} Guard Entries created successfully`,
      data: createdEntries
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.guardEntry = async (req, res, next) => {
  try {
    const entries = await GuardEntry.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: GrnEntry,
          as: "grn_entries", // Must match the association alias
          required: false,
          include: [
            {
              model: PmCode,
              as: "pm_code",
              required: false
            },
            {
              model: RmCode,
              as: "rmcode",
              required: false
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: "All Guard Entries fetched successfully",
      data: entries
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteGuardEntry = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const entry = await GuardEntry.findByPk(id);
    if (!entry) {
      const error = new Error("Guard Entry not found");
      error.status = 400;
      return next(error);
    }
    const { inward_number } = entry;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Guard entry '${inward_number}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    await entry.destroy();

    res.status(200).json({ message: "Guard entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update Guard Entry
exports.updateGuardEntry = async (req, res, next) => {
  const { id } = req.params;
  const {
    user_id,
    name,
    inward_number,
    vehicle_number,
    quantity_net,
    guard_type,
    product_name,
    product_id,
    sender_name,
    quantity_unit
  } = req.body;
  try {
    const entry = await GuardEntry.findByPk(id);
    if (!entry) {
      const error = new Error("Guard Entry not found");
      error.status = 400;
      return next(error);
    }

    const { entry_date, entry_time } = getISTDateTime();

    await entry.update({
      inward_number,
      vehicle_number,
      name,
      quantity_net,
      guard_type,
      product_name,
      product_id,
      sender_name,
      quantity_unit,
      entry_date,
      entry_time
    });

    const user = await User.findByPk(user_id);
    const username = user ? user?.username : "Unknown User";
    const logMessage = `Guard entry '${inward_number}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.status(200).json({
      message: "Guard Entry updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
