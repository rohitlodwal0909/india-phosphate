const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const {
  BmrRecordsModel,
  LineClearance,
  LineClearanceKeyPoint,
  Qcbatch,
  ProductionResult
} = db;
const sequelize = db.sequelize; // ✅ THIS WAS MISSING
const { Op } = require("sequelize");

exports.index = async (req, res, next) => {
  try {
    const data = await BmrRecordsModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Qcbatch,
          as: "records",
          required: false
        }
      ]
    });

    res.status(200).json({ message: "BMR Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.getProductionBatches = async (req, res, next) => {
  try {
    // Step 1: Get all batch_ids from BMR
    const bmrRecords = await BmrRecordsModel.findAll({
      attributes: ["batch_id"]
    });

    // Step 2: Extract batch_ids
    const batchIds = bmrRecords.map((item) => item.batch_id);

    // Step 3: Get Qcbatch where id NOT IN batchIds
    const data = await Qcbatch.findAll({
      where: {
        id: {
          [Op.notIn]: batchIds
        }
      },
      include: [
        {
          model: ProductionResult,
          as: "production_results",
          required: true
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.status(200).json({
      message: "QCBatches fetched (excluding BMR batches)",
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// Create GRN Entry
exports.store = async (req, res, next) => {
  try {
    const data = await BmrRecordsModel.create({
      ...req.body,
      user_id: req.admin.id
    });

    res.status(201).json({
      message: "BMR Record created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLineClearance = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      clearance_date,
      bmr_product_id,
      batch_no,
      cleaning_by,
      checked_by,
      key_points
    } = req.body;

    const clearance = await LineClearance.findByPk(id);

    if (!clearance) {
      await transaction.rollback();
      return res.status(404).json({
        status: false,
        message: "Record not found"
      });
    }

    await clearance.update(
      {
        clearance_date,
        bmr_product_id,
        batch_no,
        cleaning_by,
        checked_by
      },
      { transaction }
    );

    // delete old key points
    await LineClearanceKeyPoint.destroy({
      where: { line_clearance_id: id },
      transaction
    });

    // insert new
    const keyPayload = Object.keys(key_points).map((key) => ({
      line_clearance_id: id,
      key_name: key,
      cleaning_status: key_points[key]?.cleaning,
      checked_status: key_points[key]?.checked
    }));

    await LineClearanceKeyPoint.bulkCreate(keyPayload, {
      transaction
    });

    await transaction.commit();

    return res.json({
      status: true,
      message: "Line Clearance Updated"
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Update failed"
    });
  }
};

exports.getLineClearanceByBmr = async (req, res) => {
  try {
    const { bmr_id } = req.params;

    const record = await LineClearance.findOne({
      where: { bmr_id },
      include: [
        {
          model: LineClearanceKeyPoint,
          as: "key_points" // ✅ EXACT alias
        }
      ]
    });

    return res.json({
      status: true,
      data: record
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch Line Clearance"
    });
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const entry = await BmrRecordsModel.findByPk(req.params.id);
    if (!entry) {
      const error = new Error("BMR not found");
      error.status = 400;
      return next(error);
    }

    await entry.destroy();
    res.status(200).json({ message: "BMR Record deleted" });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await BmrRecordsModel.findByPk(id);

    if (!record) {
      return res.status(404).json({
        message: "BMR Record not found"
      });
    }

    /* ✅ Normalize fields */
    const payload = {
      ...req.body,

      // 👇 ensure STRING is stored in DB
      equipment_used: Array.isArray(req.body.equipment_used)
        ? JSON.stringify(req.body.equipment_used)
        : req.body.equipment_used || "[]"
    };

    await record.update(payload);

    res.status(200).json({
      message: "BMR Record updated successfully",
      data: record
    });
  } catch (error) {
    console.error("Update BMR Error:", error);
    next(error);
  }
};
