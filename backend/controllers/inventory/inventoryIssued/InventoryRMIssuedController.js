const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, RmCode, RMIssueModel, Qcbatch, ProductionResult } = db;

const openingStock = {
  RM1: 4000,
  RM2: 0,
  RM3: 0,
  RM4: 10000,
  RM5: 33000,
  RM6: 500,
  RM7: 0,
  RM8: 20,
  RM9: 57000,
  RM9A: 108200,
  RM10: 0,
  RM11: 39400,
  RM12: 6300,
  RM15: 500,
  RM16: 3,
  RM17: 1,
  RM18: 215,
  RM19: 2500,
  RM21: 7,
  RM22: 2000,
  RM25: 33800,
  RM25A: 12000,
  RM26: 35500,
  RM26A: 30800,
  RM27: 475,
  RM30: 20000,
  RM42: 250,
  RM50: 51750,
  RM53: 2500,
  RM57: 100,
  RM58: 1,
  RM59: 0.5,
  RM60: 50,
  RM63: 1,
  RM65: 2000,
  RM68: 3000,
  RM74: 25,
  RM90: 25,
  RM97: 100000
};

exports.getStoreRM = async (req, res, next) => {
  try {
    const equipments = await RmCode.findAll({
      include: [
        {
          model: GrnEntry,
          as: "rmcodes",
          attributes: ["quantity", "unit"],
          where: { type: "material", qa_qc_status: "APPROVED" },
          required: false
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
      const code = eq.rm_code;

      // ✅ Opening
      const openingQty = openingStock[code] || 0;

      // ✅ GRN Total (IN)
      const grnTotal =
        eq.rmcodes?.reduce((sum, g) => sum + Number(g.quantity || 0), 0) || 0;

      // ✅ Issued Total (OUT)
      const issuedTotal =
        eq.issuedRawMaterial?.reduce(
          (sum, i) => sum + Number(i.quantity || 0),
          0
        ) || 0;

      return {
        id: eq.id,
        code: code,
        name: eq.rm_name || eq.rm_code,
        unit: eq.rmcodes?.[0]?.unit || "KG",
        total_quantity: openingQty + grnTotal - issuedTotal
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
