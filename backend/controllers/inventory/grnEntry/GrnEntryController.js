const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const { createLogEntry } = require("../../../helper/createLogEntry");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");
const {
  GrnEntry,
  RawMaterialQcResult,
  User,
  PmCode,
  RmCode,
  Equipment,
  GuardEntry
} = db;

// Create GRN Entry
exports.store = async (req, res, next) => {
  try {
    const { user_id, store_rm_code, type } = req.body;
    const { entry_date, entry_time } = getISTDateTime();

    const lastEntry = await GrnEntry.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["grn_number"]
    });

    // 2️⃣ Generate new GRN number

    let newGrnNumber = "GRN0001";
    if (lastEntry && lastEntry.grn_number) {
      const lastNumber = parseInt(lastEntry.grn_number.replace("GRN", "")) || 0;
      const nextNumber = lastNumber + 1;
      newGrnNumber = `GRN${String(nextNumber).padStart(4, "0")}`;
    }

    let status = "PENDING";
    if (type == "equipment") {
      status = "APPROVED";
    }

    const data = await GrnEntry.create({
      ...req.body,
      grn_number: newGrnNumber,
      qa_qc_status: status,
      grn_date: entry_date,
      grn_time: entry_time
    });

    // Create notification for roles
    await createNotificationByRoleId({
      title: "New Store Entry",
      message: `Store Entry has been successfully created.`,
      role_id: 2
    });

    await createNotificationByRoleId({
      title: "New QC Store",
      message:
        "A new store entry has been created. Please verify the material in QC.",
      role_id: 3
    });

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const logMessage = `Store entry for RM Code ${store_rm_code} was created by ${username} on ${entry_date} at ${entry_time}.`;
    await createLogEntry({
      user_id,
      message: logMessage
    });

    res.status(201).json({
      message: "Store entry created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const entries = await GrnEntry.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: RawMaterialQcResult,
          as: "qc_result",
          required: false,
          attributes: ["tested_by"],
          include: [
            {
              model: User,
              as: "testedBy",
              required: false
            }
          ]
        },
        {
          model: GuardEntry,
          as: "guard_entry",
          required: true
        },
        {
          model: RmCode,
          as: "rmcode",
          required: false
        },
        {
          model: PmCode,
          as: "pm_code",
          required: false
        },
        {
          model: User,
          as: "pmapproveBy",
          required: false
        }
      ]
    });

    res.status(200).json({ message: "GRN Entries fetched", data: entries });
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const id = req.params.id;
    const entry = await GrnEntry.findOne({
      where: {
        guard_entry_id: id
      },
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
        },
        {
          model: Equipment,
          as: "equipments",
          required: false
        }
      ]
    });
    if (!entry) {
      const error = new Error("GRN Entry not found");
      error.status = 400;
      return next(error);
    }
    res.status(200).json({ message: "GRN Entry fetch", data: entry });
  } catch (error) {
    next(error);
  }
};

// Update GRN Entry
exports.update = async (req, res, next) => {
  try {
    const entry = await GrnEntry.findByPk(req.params.id);

    if (!entry) {
      const error = new Error("GRN Entry not found");
      error.status = 400;
      return next(error);
    }

    const oldUserId = req.body?.user_id || entry.user_id;

    await entry.update(req.body);

    const user = await User.findByPk(oldUserId);
    const username = user ? user.username : "Unknown User";

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Store entry for RM Code '${entry.store_rm_code}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: oldUserId, message: logMessage });
    res.status(200).json({ message: "GRN Entry updated", data: entry });
  } catch (error) {
    next(error);
  }
};

// Delete GRN Entry
exports.destroy = async (req, res, next) => {
  const { user_id } = req.body;
  try {
    const entry = await GrnEntry.findByPk(req.params.id);
    if (!entry) {
      const error = new Error("GRN Entry not found");
      error.status = 400;
      return next(error);
    }

    const store_rm_code = entry.store_rm_code;

    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const { entry_date, entry_time } = getISTDateTime();

    const logMessage = `Store entry for RM Code '${store_rm_code}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id, message: logMessage });

    await entry.destroy();
    res.status(200).json({ message: "GRN Entry deleted" });
  } catch (error) {
    next(error);
  }
};
