const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { ReplacementModel, Equipment, Product, ProductionPlanning } = db;

exports.index = async (req, res, next) => {
  try {
    const data = await ProductionPlanning.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Equipment
        },
        {
          model: Product
        }
      ]
    });

    res
      .status(200)
      .json({ message: "Production Planning fetched", data: data });
  } catch (error) {
    next(error);
  }
};

// Create GRN Entry
exports.create = async (req, res, next) => {
  try {
    const {
      equipment_id,
      material_id,
      quantity,
      unit,
      quality,
      batch_no,
      expected_fpr_date,
      labours,
      work_order_no,
      output,
      remark
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!equipment_id)
      return res.status(400).json({ message: "Equipment is required" });

    if (!material_id)
      return res.status(400).json({ message: "Material is required" });

    if (!quantity)
      return res.status(400).json({ message: "Quantity is required" });

    const data = await ProductionPlanning.create({
      equipment_id,
      material_id,
      quantity,
      unit,
      quality,
      batch_no,
      expected_fpr_date,
      labours,
      output,
      remark,
      work_order_no,
      user_id: req.admin.id
    });

    const title = "Production Planning Created";
    const message = `Production planning has been completed for Work Order ${data.work_order_no} and Batch ${data.batch_no}.`;
    // Create Notification
    await createNotificationByRoleId({
      title,
      message,
      role_id: 8,
      module_id: 2,
      submodule_id: 9
    });

    res.status(201).json({
      message: "Production Planning Created Successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      equipment_id,
      material_id,
      quantity,
      unit,
      quality,
      batch_no,
      expected_fpr_date,
      labours,
      work_order_no,
      output
    } = req.body;

    const { id } = req.params; // update id

    /* ================= VALIDATION ================= */

    if (!equipment_id)
      return res.status(400).json({ message: "Equipment is required" });

    if (!material_id)
      return res.status(400).json({ message: "Material is required" });

    if (!quantity)
      return res.status(400).json({ message: "Quantity is required" });

    /* ================= CHECK RECORD ================= */

    const planning = await ProductionPlanning.findByPk(id);

    if (!planning) {
      return res.status(404).json({
        message: "Production Planning not found"
      });
    }

    /* ================= UPDATE ================= */

    await planning.update({
      equipment_id,
      material_id,
      quantity,
      unit,
      quality,
      batch_no,
      expected_fpr_date,
      labours,
      output,
      work_order_no,
      user_id: req.admin.id
    });

    res.status(200).json({
      message: "Production Planning Updated Successfully",
      data: planning
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check id
    if (!id) {
      return res.status(400).json({
        message: "Production Planning id is required"
      });
    }

    // find record
    const productionPlaning = await ProductionPlanning.findByPk(id);

    if (!productionPlaning) {
      return res.status(404).json({
        message: "Production Planning not found"
      });
    }

    // update record
    await productionPlaning.destroy();

    return res.status(200).json({
      message: "Production Planning delete successfully"
    });
  } catch (error) {
    next(error);
  }
};
