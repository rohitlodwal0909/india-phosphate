const { where } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const {
  BmrRecordsModel,
  Qcbatch,
  ProductionResult,
  RmCode,
  PmCode,
  Equipment,
  LineClearance,
  BmrDispensingRawMaterial,
  LineClearanceKeyPoint,
  BmrSieveIntegrity,
  BmrEquipmentList,
  BmrInprocessCheck,
  BmrQcIntimation,
  BmrPMIssuance
} = db;
const sequelize = db.sequelize;

exports.index = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await BmrRecordsModel.findOne({
      where: { id },
      attributes: ["batch_id"],
      include: [
        {
          model: Qcbatch,
          attributes: ["product_name", "size", "qc_batch_number"],
          as: "records",
          required: false,
          include: [
            {
              model: ProductionResult,
              as: "production_results",
              include: [
                {
                  model: RmCode,
                  as: "rmcodes",
                  attributes: ["id", "rm_code"]
                },
                {
                  model: PmCode,
                  as: "pmcodes",
                  attributes: ["id", "name"]
                },
                {
                  model: Equipment,
                  as: "equipment",
                  attributes: ["id", "name"]
                }
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json({ message: "BMR Fetched", data: data });
  } catch (error) {
    next(error);
  }
};

exports.getbmrReport = async (req, res, next) => {
  const { id } = req.params;
  try {
    const lineClearance = await LineClearance.findOne({
      where: { bmr_id: id },
      include: [
        {
          model: LineClearanceKeyPoint,
          required: true,
          as: "key_points"
        }
      ]
    });

    const dispensingRm = await BmrDispensingRawMaterial.findAll({
      where: { bmr_id: id }
    });

    const equipmentno = await BmrEquipmentList.findAll({
      where: { bmr_id: id }
    });

    const sieveIntegiry = await BmrSieveIntegrity.findAll({
      where: { bmr_id: id }
    });

    const inprocesscheck = await BmrInprocessCheck.findOne({
      where: { bmr_id: id }
    });

    const qcintimation = await BmrQcIntimation.findOne({
      where: { bmr_id: id }
    });

    const pmIssuance = await BmrPMIssuance.findAll({
      where: { bmr_id: id }
    });

    res.status(200).json({
      lineClearance,
      dispensingRm,
      equipmentno,
      sieveIntegiry,
      inprocesscheck,
      qcintimation,
      pmIssuance
    });
  } catch (error) {
    next(error);
  }
};

exports.saveLineClearance = async (req, res) => {
  const {
    id,
    user_id,
    bmr_id,
    clearance_date,
    previous_product,
    cleaning_done_by,
    checked_by,
    key_points
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let lineClearance;

    // 🔹 UPDATE FLOW
    if (id) {
      lineClearance = await LineClearance.findByPk(id, { transaction });

      if (!lineClearance) {
        await transaction.rollback();
        return res.status(404).json({ message: "Line clearance not found" });
      }

      await lineClearance.update(
        {
          clearance_date,
          bmr_product_id: previous_product || null,
          cleaning_by: cleaning_done_by,
          checked_by,
          user_id: req.admin.id
        },
        { transaction }
      );

      // 🔥 Purane key points delete
      await LineClearanceKeyPoint.destroy({
        where: { line_clearance_id: id },
        transaction
      });
    }

    // 🔹 CREATE FLOW
    else {
      lineClearance = await LineClearance.create(
        {
          bmr_id,
          clearance_date,
          bmr_product_id: previous_product || null,
          cleaning_by: cleaning_done_by,
          checked_by,
          user_id: req.admin.id,
          status: "Pending"
        },
        { transaction }
      );
    }

    // 🔹 KEY POINTS INSERT
    if (Array.isArray(key_points) && key_points.length) {
      const keyPointPayload = key_points.map((kp) => ({
        line_clearance_id: lineClearance.id,
        key_name: kp.key_name,
        cleaning_status: kp.cleaning_status,
        checked_status: kp.checked_status
      }));

      await LineClearanceKeyPoint.bulkCreate(keyPointPayload, {
        transaction
      });
    }

    await transaction.commit();

    return res.json({
      success: true,
      message: id
        ? "Line Clearance updated successfully"
        : "Line Clearance saved successfully",
      data: lineClearance
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Line Clearance Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.saveDispensingRawMaterial = async (req, res) => {
  const items = req.body;

  try {
    for (const item of items) {
      if (item.id) {
        // UPDATE
        await BmrDispensingRawMaterial.update(
          {
            actual_qty: JSON.stringify(item.actual_qty),
            qc_reference: JSON.stringify(item.qc_reference),
            issued_by: item.issued_by,
            checked_by: item.checked_by,
            checked_date: item.checked_date
          },
          { where: { id: item.id } }
        );
      } else {
        // CREATE
        await BmrDispensingRawMaterial.create({
          bmr_id: item.bmr_id,
          rm_id: item.rm_id,
          actual_qty: JSON.stringify(item.actual_qty),
          qc_reference: JSON.stringify(item.qc_reference),
          issued_by: item.issued_by,
          checked_by: item.checked_by,
          checked_date: item.checked_date
        });
      }
    }

    res.json({
      success: true,
      message: "Dispensing Raw Material saved successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.saveEquipmentList = async (req, res) => {
  const items = req.body;

  try {
    for (const item of items) {
      if (item.id) {
        // 🔁 UPDATE existing record
        await BmrEquipmentList.update(
          {
            equipment_no: item.equipment_no || null,
            equipment_id: item.equipment_id,
            bmr_id: item.bmr_id,
            user_id: req.admin.id
          },
          {
            where: { id: item.id }
          }
        );
      } else {
        // ➕ CREATE new record
        await BmrEquipmentList.create({
          bmr_id: item.bmr_id,
          equipment_id: item.equipment_id,
          user_id: req.admin.id,
          equipment_no: item.equipment_no || null
        });
      }
    }

    return res.json({
      success: true,
      message: "Equipment list saved successfully"
    });
  } catch (err) {
    console.error("Equipment Save Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.saveSieveIntegrityRecord = async (req, res) => {
  const items = req.body;

  try {
    for (const item of items) {
      if (item.id) {
        await BmrSieveIntegrity.update(
          {
            time: item.time,
            sieve_status: item.sieve_status,
            checked_by: item.checked_by,
            result: item.result,
            remark: item.remark,
            bmr_id: item.bmr_id,
            user_id: req.admin.id
          },
          {
            where: { id: item.id }
          }
        );
      } else {
        await BmrSieveIntegrity.create({
          bmr_id: item.bmr_id,
          user_id: req.admin.id,
          time: item.time,
          sieve_status: item.sieve_status,
          checked_by: item.checked_by,
          result: item.result,
          remark: item.remark
        });
      }
    }

    return res.json({
      success: true,
      message: "Sieve integrity saved successfully"
    });
  } catch (err) {
    console.error("Sieve Integirty Save Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.createInprocessCheck = async (req, res) => {
  try {
    const { id, bmr_id, date, key_points, records } = req.body;

    if (!bmr_id || !date) {
      return res.status(400).json({
        success: false,
        message: "BMR ID and date required"
      });
    }

    const payload = {
      bmr_id,
      date,
      key_points: key_points ? JSON.stringify(key_points) : null,
      records: records ? JSON.stringify(records) : null,
      user_id: req.admin?.id || null
    };

    let data;

    // 🔹 UPDATE
    if (id) {
      data = await BmrInprocessCheck.findByPk(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Inprocess check not found"
        });
      }

      await data.update(payload);
    }
    // 🔹 CREATE
    else {
      data = await BmrInprocessCheck.create(payload);
    }

    return res.status(id ? 200 : 201).json({
      success: true,
      message: id
        ? "Inprocess check updated successfully"
        : "Inprocess check saved successfully",
      data: {
        ...data.toJSON(),
        key_points: payload.key_points ? JSON.parse(payload.key_points) : [],
        records: payload.records ? JSON.parse(payload.records) : []
      }
    });
  } catch (error) {
    console.error("InprocessCheck error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.saveQCintimation = async (req, res) => {
  try {
    const {
      id,
      bmr_id,
      sampled_by,
      date,
      quantity_sampled,
      results,
      checked_by
    } = req.body;

    if (!bmr_id || !date) {
      return res.status(400).json({
        success: false,
        message: "BMR ID and date are required"
      });
    }

    const payload = {
      bmr_id,
      sample_by: sampled_by,
      date,
      quantity_sampled,
      results: results ? JSON.stringify(results) : null,
      checked_by,
      user_id: req.admin?.id || null
    };

    let data;

    // 🔹 UPDATE
    if (id) {
      data = await BmrQcIntimation.findByPk(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "QC Intimation not found"
        });
      }

      await data.update(payload);
    }
    // 🔹 CREATE
    else {
      data = await BmrQcIntimation.create(payload);
    }

    return res.status(id ? 200 : 201).json({
      success: true,
      message: id
        ? "QC Intimation updated successfully"
        : "QC Intimation saved successfully",
      data: {
        ...data.toJSON(),
        results: payload.results ? JSON.parse(payload.results) : []
      }
    });
  } catch (error) {
    console.error("QC Intimation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.savePMIssuence = async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];

    const savedData = [];

    for (const item of records) {
      const {
        id,
        bmr_id,
        pm_id,
        issued_by,
        received_by,
        actual_qty,
        qc_reference
      } = item;

      const payload = {
        bmr_id,
        pm_id,
        issued_by,
        received_by,
        actual_qty: actual_qty ? JSON.stringify(actual_qty) : null,
        qc_reference: qc_reference ? JSON.stringify(qc_reference) : null,
        user_id: req.admin?.id || null
      };

      let data;

      // 🔹 UPDATE
      if (id) {
        data = await BmrPMIssuance.findByPk(id);

        if (!data) {
          continue; // agar ek record nahi mila to next pe chala jao
        }

        await data.update(payload);
      }
      // 🔹 CREATE
      else {
        data = await BmrPMIssuance.create(payload);
      }

      savedData.push(data);
    }

    return res.status(201).json({
      success: true,
      message: "PM Issuance records saved successfully",
      data: savedData
    });
  } catch (error) {
    console.error("PM Issuance error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
