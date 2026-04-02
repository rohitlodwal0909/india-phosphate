const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, RmCode, RMIssueModel, Qcbatch, ProductionResult } = db;

exports.getStoreRM = async (req, res, next) => {
  try {
    const equipments = await RmCode.findAll({
      include: [
        {
          model: GrnEntry,
          as: "rmcodes",
          attributes: ["quantity", "unit"],
          where: { type: "material", qa_qc_status: "APPROVED" },
          required: true
        },
        {
          model: RMIssueModel,
          as: "issuedRawMaterial",
          attributes: ["quantity"],
          required: false
        }
      ]
    });

    const data = equipments.map((eq) => {
      const grnTotal = eq.rmcodes.reduce(
        (sum, g) => sum + Number(g.quantity),
        0
      );

      const issuedTotal = eq.issuedRawMaterial.reduce(
        (sum, i) => sum + Number(i.quantity),
        0
      );

      return {
        id: eq.id,
        name: eq.rm_code,
        unit: eq.rmcodes[0]?.unit || null,
        total_quantity: grnTotal - issuedTotal
      };
    });

    res.status(200).json({
      message: "Store RM Fetched",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.saveIssuedRM = async (req, res, next) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const data = await RMIssueModel.create({
      ...req.body,
      user_id: req.admin.id,
      date: entry_date + entry_time
    });

    res.status(201).json({
      message: "Raw material issue successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.getIssuedRM = async (req, res, next) => {
  try {
    const data = await RMIssueModel.findAll({
      include: [
        {
          model: RmCode,
          as: "issueRm"
        },
        {
          model: Qcbatch,
          attributes: ["id", "qc_batch_number"]
        }
      ]
    });

    res
      .status(200)
      .json({ message: "Issued Raw Material Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.getBatches = async (req, res, next) => {
  try {
    const batches = await Qcbatch.findAll({
      attributes: ["id", "qc_batch_number"],
      include: [
        {
          model: ProductionResult,
          as: "production_results",
          required: true,
          include: [
            {
              model: RmCode,
              as: "rmcodes"
            }
          ]
        }
      ]
    });

    res.status(200).json({ message: "Issued PM Fetched", data: batches });
  } catch (error) {
    next(error);
  }
};

exports.deleteIssuedRM = async (req, res, next) => {
  try {
    const entry = await RMIssueModel.findByPk(req.params.id);
    if (!entry) {
      const error = new Error("Raw Material Entry not found");
      error.status = 400;
      return next(error);
    }

    await entry.destroy();
    res.status(200).json({ message: "Raw Material Entry deleted" });
  } catch (error) {
    next(error);
  }
};

exports.updateIssuedRM = async (req, res, next) => {
  try {
    const { id } = req.body; // 🔑 id from URL
    const entry = await RMIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("Raw material issue entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({
      ...req.body
    });

    res.status(200).json({
      message: "Raw material issue updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
