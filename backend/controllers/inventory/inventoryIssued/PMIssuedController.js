const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, PmCode, PMIssueModel, Qcbatch, ProductionResult } = db;

exports.getStorePM = async (req, res, next) => {
  try {
    const equipments = await PmCode.findAll({
      include: [
        {
          model: GrnEntry,
          as: "pmcodes",
          attributes: ["quantity", "unit"],
          where: { type: "pm", qa_qc_status: "APPROVED" },
          required: true
        },
        {
          model: PMIssueModel,
          as: "issuedPM",
          attributes: ["quantity", "return_bag"],
          required: false
        }
      ]
    });

    const data = equipments.map((eq) => {
      const grnTotal = eq.pmcodes.reduce(
        (sum, g) => sum + Number(g.quantity),
        0
      );

      const issuedTotal = eq.issuedPM.reduce(
        (sum, i) => sum + Number(i.quantity),
        0
      );

      const returnedTotal = eq.issuedPM.reduce(
        (sum, i) => sum + Number(i.return_bag || 0),
        0
      );

      return {
        id: eq.id,
        name: eq.name,
        unit: eq.pmcodes[0]?.unit || null,
        total_quantity: grnTotal - issuedTotal + returnedTotal
      };
    });

    res.status(200).json({
      message: "Store PM Fetched",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.saveIssuedPM = async (req, res, next) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const data = await PMIssueModel.create({
      ...req.body,
      user_id: req.admin.id,
      date: entry_date + entry_time
    });
    res.status(201).json({
      message: "PM issue successfully",
      data
    });
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
              model: PmCode,
              as: "pmcodes"
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

exports.getIssuePM = async (req, res, next) => {
  try {
    const data = await PMIssueModel.findAll({
      include: [
        {
          model: PmCode,
          as: "issuePM"
        },
        {
          model: Qcbatch
        }
      ]
    });

    res.status(200).json({ message: "Issued PM Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.deleteIssuedPM = async (req, res, next) => {
  try {
    const entry = await PMIssueModel.findByPk(req.params.id);
    if (!entry) {
      const error = new Error("PM Entry not found");
      error.status = 400;
      return next(error);
    }

    await entry.destroy();
    res.status(200).json({ message: "PM Entry deleted" });
  } catch (error) {
    next(error);
  }
};

exports.returnPM = async (req, res, next) => {
  try {
    const { id, return_bag, returned_by } = req.body;

    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      return res.status(404).json({
        message: "Equipment issue entry not found"
      });
    }

    // total issued quantity
    const issuedQty = entry.quantity;
    const alreadyReturned = entry.return_bag || 0;

    // validation
    if (return_bag < alreadyReturned) {
      return res.status(400).json({
        message:
          "Returned quantity cannot be less than already returned quantity"
      });
    }

    if (return_bag > issuedQty) {
      return res.status(400).json({
        message: "Returned quantity cannot be greater than issued quantity"
      });
    }

    const newlyReturned = return_bag - alreadyReturned;

    // nothing new to return
    if (newlyReturned === 0) {
      return res.status(200).json({
        message: "No new equipment returned",
        data: entry
      });
    }

    await entry.update({
      return_bag,
      returned_by
    });

    res.status(200).json({
      message: "PM returned successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

exports.updateIssuedPM = async (req, res, next) => {
  try {
    const { id } = req.body; // 🔑 id from URL
    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("PM issue entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({
      ...req.body
    });

    res.status(200).json({
      message: "PM issue updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
