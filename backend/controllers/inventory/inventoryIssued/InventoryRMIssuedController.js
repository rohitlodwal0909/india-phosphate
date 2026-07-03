const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const { GrnEntry, RmCode, RMIssueModel, Qcbatch, ProductionResult } = db;

const openingStock = {
  RM01: 4000,
  RM02: 0,
  RM03: 0,
  RM04: 7000,
  RM05: 31000,
  RM06: 500,
  RM07: 0,
  RM08: 10,
  RM09: 22000,
  RM10: 0,
  RM11: 16450,
  RM12: 3000,
  RM13: 0,
  RM14: 0,
  RM15: 0,
  RM16: 3, // drum
  RM17: 1, // drum
  RM18: 215, // liter
  RM19: 0,
  RM20: 0,
  RM21: 7, // drum
  RM22: 0,
  RM23: 0,
  RM24: 0,
  RM25: 39750,
  RM26: 28000, // 5000 + 23000
  RM27: 100,
  RM28: 0,
  RM29: 0,
  RM30: 10000,
  RM31: 0,
  RM32: 0,
  RM33: 0,
  RM34: "Divis",
  RM35: "Divis",
  RM36: "Divis",
  RM37: 0,
  RM38: 0,
  RM39: 0,
  RM40: 0,
  RM41: 0,
  RM42: 250,
  RM43: "Divis",
  RM44: "Divis",
  RM45: "Divis",
  RM46: "Divis",
  RM47: "Divis",
  RM48: 0,
  RM49: 0,
  RM50: 51750,
  RM51: 0,
  RM52: 0,
  RM53: 3000,
  RM54: 0,
  RM55: 0,
  RM56: 0,
  RM57: 125,
  RM58: 1, // drum
  RM59: 0.5, // tank
  RM60: 0,
  RM61: 1000, // litres
  RM62: 0,
  RM63: 1, // drum
  RM64: 0,
  RM65: 0,
  RM66: 0,
  RM67: 0,
  RM68: 0,
  RM69: 4250,
  RM70: 0,
  RM71: 0,
  RM72: 0,
  RM73: 500,
  RM74: 25,
  RM75: 33000,
  RM76: 0,
  RM77: 0,
  RM78: 0,
  RM79: 125,
  RM80: 0,
  RM81: 0,
  RM82: 0,
  RM83: 0,
  RM84: 0,
  RM85: 0,
  RM86: 0,
  RM87: 0,
  RM88: 0,
  RM89: 0,
  RM90: 25,
  RM91: 0,
  RM92: 0,
  RM93: 0,
  RM94: 0,
  RM95: 25,
  RM96: 0,
  RM97: 100000, // 100 ton = 100000 kg
  RM98: 0,
  RM99: 200,
  RM100: 50,
  RM101: 100,
  RM102: 100
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
