const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, PmCode, PMIssueModel, Qcbatch, ProductionResult } = db;

// ==============================
// Get Store PM Stock
// ==============================
exports.getStorePM = async (req, res, next) => {
  try {
    const equipments = await PmCode.findAll({
      include: [
        {
          model: GrnEntry,
          as: "pmcodes",
          attributes: ["quantity", "unit"],
          where: {
            type: "pm",
            qa_qc_status: "APPROVED"
          },
          required: false
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
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      const openingStock = Number(eq.opening_stock || 0);

      const issuedTotal = eq.issuedPM.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      const returnedTotal = eq.issuedPM.reduce(
        (sum, item) => sum + Number(item.return_bag || 0),
        0
      );

      return {
        id: eq.id,
        name: eq.name,
        unit: eq.pmcodes[0]?.unit || eq?.unit,
        total_quantity: grnTotal + openingStock - issuedTotal + returnedTotal
      };
    });

    return res.status(200).json({
      message: "Store PM fetched successfully.",
      data
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Save Issued PM
// ==============================
exports.saveIssuedPM = async (req, res, next) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const data = await PMIssueModel.create({
      ...req.body,
      user_id: req.admin.id,
      date: `${entry_date} ${entry_time}`
    });

    return res.status(201).json({
      message: "PM issued successfully.",
      data
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Batches
// ==============================
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

    return res.status(200).json({
      message: "Batches fetched successfully.",
      data: batches
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Issued PM List
// ==============================
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

    return res.status(200).json({
      message: "Issued PM fetched successfully.",
      data
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Delete Issued PM
// ==============================
exports.deleteIssuedPM = async (req, res, next) => {
  try {
    const entry = await PMIssueModel.findByPk(req.params.id);

    if (!entry) {
      const error = new Error("PM issue entry not found.");
      error.status = 404;
      return next(error);
    }

    await entry.destroy();

    return res.status(200).json({
      message: "PM issue deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Return PM
// ==============================
exports.returnPM = async (req, res, next) => {
  try {
    const { id, return_bag, returned_by } = req.body;

    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      return res.status(404).json({
        message: "PM issue entry not found."
      });
    }

    const issuedQty = Number(entry.quantity);
    const alreadyReturned = Number(entry.return_bag || 0);
    const currentReturn = Number(return_bag);

    if (currentReturn < alreadyReturned) {
      return res.status(400).json({
        message:
          "Returned quantity cannot be less than already returned quantity."
      });
    }

    if (currentReturn > issuedQty) {
      return res.status(400).json({
        message: "Returned quantity cannot exceed issued quantity."
      });
    }

    if (currentReturn === alreadyReturned) {
      return res.status(200).json({
        message: "No new PM returned.",
        data: entry
      });
    }

    await entry.update({
      return_bag: currentReturn,
      returned_by
    });

    return res.status(200).json({
      message: "PM returned successfully.",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Update Issued PM
// ==============================
exports.updateIssuedPM = async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;

    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("PM issue entry not found.");
      error.status = 404;
      return next(error);
    }

    await entry.update(updateData);

    return res.status(200).json({
      message: "PM issue updated successfully.",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
