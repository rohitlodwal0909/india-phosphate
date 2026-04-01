const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, Equipment, EquipmentIssueModel } = db;

exports.getStoreEquipment = async (req, res, next) => {
  try {
    const equipments = await Equipment.findAll({
      include: [
        {
          model: GrnEntry,
          as: "grnEntries",
          attributes: ["quantity", "unit"],
          where: { type: "equipment", qa_qc_status: "APPROVED" },
          required: true
        },
        {
          model: EquipmentIssueModel,
          as: "issuedEquipments",
          attributes: ["quantity", "return_equipment"],
          required: false
        }
      ]
    });

    const data = equipments.map((eq) => {
      // 🔹 Total GRN Quantity
      const grnTotal = eq.grnEntries.reduce(
        (sum, g) => sum + Number(g.quantity),
        0
      );

      // 🔹 Total Issued Quantity
      const issuedTotal = eq.issuedEquipments.reduce(
        (sum, i) => sum + Number(i.quantity || 0),
        0
      );

      // 🔹 Total Returned Quantity
      const returnedTotal = eq.issuedEquipments.reduce(
        (sum, i) => sum + Number(i.return_equipment || 0),
        0
      );

      return {
        id: eq.id,
        name: eq.name,
        unit: eq.grnEntries[0]?.unit || null,
        total_quantity: grnTotal - issuedTotal + returnedTotal
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
    const { id, quantity, note, type, person_name } = req.body;

    const entry = await EquipmentIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("Equipment issue entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({
      quantity,
      note,
      type,
      person_name
    });

    res.status(200).json({
      message: "Equipment issue updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

exports.returnEquipment = async (req, res, next) => {
  try {
    const { id, return_equipment, returned_by } = req.body;

    const entry = await EquipmentIssueModel.findByPk(id);

    if (!entry) {
      return res.status(404).json({
        message: "Equipment issue entry not found"
      });
    }

    // total issued quantity
    const issuedQty = entry.quantity;
    const alreadyReturned = entry.return_equipment || 0;

    // validation
    if (return_equipment < alreadyReturned) {
      return res.status(400).json({
        message:
          "Returned quantity cannot be less than already returned quantity"
      });
    }

    if (return_equipment > issuedQty) {
      return res.status(400).json({
        message: "Returned quantity cannot be greater than issued quantity"
      });
    }

    const newlyReturned = return_equipment - alreadyReturned;

    // nothing new to return
    if (newlyReturned === 0) {
      return res.status(200).json({
        message: "No new equipment returned",
        data: entry
      });
    }

    await entry.update({
      return_equipment,
      returned_by,
      received_by: req.admin.id
    });

    res.status(200).json({
      message: "Equipment returned successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
