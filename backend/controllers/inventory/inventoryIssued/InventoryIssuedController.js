const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, PmCode, Equipment, GuardEntry, EquipmentIssueModel } = db;

exports.getStoreEquipment = async (req, res, next) => {
  try {
    const equipments = await Equipment.findAll({
      include: [
        {
          model: GrnEntry,
          as: "grnEntries",
          attributes: ["quantity", "unit"],
          where: { type: "equipment" },
          required: true
        },
        {
          model: EquipmentIssueModel,
          as: "issuedEquipments",
          attributes: ["quantity"],
          required: false
        }
      ]
    });

    const data = equipments.map((eq) => {
      const grnTotal = eq.grnEntries.reduce(
        (sum, g) => sum + Number(g.quantity),
        0
      );

      const issuedTotal = eq.issuedEquipments.reduce(
        (sum, i) => sum + Number(i.quantity),
        0
      );

      return {
        id: eq.id,
        name: eq.name,
        unit: eq.grnEntries[0]?.unit || null,
        total_quantity: grnTotal - issuedTotal
      };
    });

    res.status(200).json({
      message: "Store Equipment Fetched",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.saveIssuedEquipment = async (req, res, next) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const data = await EquipmentIssueModel.create({
      ...req.body,
      date: entry_date + entry_time
    });
    res.status(201).json({
      message: "Equipment issue successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.getIssuedEquipment = async (req, res, next) => {
  try {
    const data = await EquipmentIssueModel.findAll({
      include: [
        {
          model: Equipment,
          as: "issueequipment"
        }
      ]
    });

    res.status(200).json({ message: "Issued Equipment Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.deleteIssuedEquipment = async (req, res, next) => {
  try {
    const entry = await EquipmentIssueModel.findByPk(req.params.id);
    if (!entry) {
      const error = new Error("Equipment Entry not found");
      error.status = 400;
      return next(error);
    }

    await entry.destroy();
    res.status(200).json({ message: "Equipment Entry deleted" });
  } catch (error) {
    next(error);
  }
};

exports.updateIssuedEquipment = async (req, res, next) => {
  try {
    const { id } = req.body; // 🔑 id from URL

    const entry = await EquipmentIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("Equipment issue entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({
      ...req.body
    });

    res.status(200).json({
      message: "Equipment issue updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
