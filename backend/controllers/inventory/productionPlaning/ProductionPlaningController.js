const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { ReplacementModel, Equipment, Product, ProductionPlanning } = db;
const { Op } = require("sequelize");

exports.index = async (req, res, next) => {
  try {
    const data = await ProductionPlanning.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["product_name"]
        },
        {
          model: Equipment,
          attributes: ["name"]
        }
      ]
    });

    // Group data by date
    const groupedData = data.reduce((acc, item) => {
      const date = item.date;

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);

      return acc;
    }, {});

    res.status(200).json({
      message: "Production Planning fetched",
      data: groupedData
    });
  } catch (error) {
    next(error);
  }
};

// Create GRN Entry
exports.create = async (req, res, next) => {
  try {
    const roleId = Number(req.admin?.role_id);
    if (![1, 3].includes(roleId)) {
      return res.status(403).json({ message: "Only QA and Admin can create production planning." });
    }
    const isAdmin = roleId === 1;

    const { date, items } = req.body;

    /* ================= VALIDATION ================= */

    if (!date) {
      return res.status(400).json({
        message: "Production date is required"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one production planning item is required"
      });
    }

    /* ================= CREATE MULTIPLE RECORDS ================= */

    const createdData = [];

    for (const item of items) {
      const {
        equipment_id,
        material_id,
        quality,
        batch_no,
        work_order_no,
        labours,
        output_morning,
        target,
        name_of_person,
        output_evening
      } = item;

      const data = await ProductionPlanning.create({
        /* Single Date */
        date: date,

        /* Multiple Fields */
        equipment_id,
        material_id,
        quality,
        batch_no,
        work_order_no,
        labours,
        target,
        name_of_person,
        /* Output */
        output_morning: isAdmin ? output_morning : null,
        output_evening: isAdmin ? output_evening : null,

        /* Admin */
        user_id: req.admin.id
      });

      createdData.push(data);
    }

    /* ================= NOTIFICATION ================= */

    const title = "Production Planning Created";

    const message = `Production planning has been created successfully for ${createdData.length} item(s) on ${date}.`;

    await createNotificationByRoleId({
      title,
      message,
      link: "inventory/planing",
      role_id: 8,
      module_id: 2,
      submodule_id: 9
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      message: "Production Planning Created Successfully",

      data: createdData
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, items } = req.body;
    const roleId = Number(req.admin?.role_id);
    const isAdmin = roleId === 1;
    const isQa = roleId === 3;
    const isProduction = roleId === 6;

    if (!isAdmin && !isQa && !isProduction) {
      return res.status(403).json({ message: "You cannot edit production planning." });
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one production planning item is required"
      });
    }

    /* =====================================================
       CHECK FIRST RECORD
    ===================================================== */

    const firstPlanning = await ProductionPlanning.findByPk(id);

    if (!firstPlanning) {
      return res.status(404).json({
        message: "Production Planning not found"
      });
    }

    if (isProduction) {
      if (items.some((item) => !item.id)) {
        return res.status(403).json({ message: "Production can only update output quantity on existing rows." });
      }

      const updatedItems = [];
      for (const item of items) {
        const planning = await ProductionPlanning.findOne({
          where: { id: item.id, date: firstPlanning.date }
        });
        if (!planning) {
          return res.status(404).json({ message: `Production Planning with ID ${item.id} not found for this date.` });
        }

        const outputUpdates = {};
        if (Object.prototype.hasOwnProperty.call(item, "output_morning")) {
          outputUpdates.output_morning = item.output_morning;
        }
        if (Object.prototype.hasOwnProperty.call(item, "output_evening")) {
          outputUpdates.output_evening = item.output_evening;
        }
        await planning.update(outputUpdates);
        updatedItems.push(planning);
      }

      return res.status(200).json({
        message: "Output quantities updated successfully.",
        data: updatedItems
      });
    }

    const existingItems = await ProductionPlanning.findAll({
      where: {
        date: date
      }
    });

    const incomingIds = items
      .filter((item) => item.id)
      .map((item) => Number(item.id));

    const deletedIds = existingItems
      .filter((existingItem) => !incomingIds.includes(Number(existingItem.id)))
      .map((existingItem) => existingItem.id);

    if (deletedIds.length > 0) {
      await ProductionPlanning.destroy({
        where: {
          id: {
            [Op.in]: deletedIds
          }
        }
      });
    }

    /* =====================================================
       UPDATE / CREATE ITEMS
    ===================================================== */

    const updatedItems = [];

    for (const item of items) {
      /* =================================================
         VALIDATION
      ================================================= */

      if (!item.material_id) {
        return res.status(400).json({
          message: "Material is required"
        });
      }

      if (!item.equipment_id) {
        return res.status(400).json({
          message: "Equipment is required"
        });
      }

      if (
        item.quality === undefined ||
        item.quality === null ||
        item.quality === ""
      ) {
        return res.status(400).json({
          message: "Quality is required"
        });
      }

      if (!item.batch_no) {
        return res.status(400).json({
          message: "Batch number is required"
        });
      }

      if (!item.work_order_no) {
        return res.status(400).json({
          message: "Work order number is required"
        });
      }

      /* =================================================
         EXISTING RECORD -> UPDATE
      ================================================= */

      if (item.id) {
        const planning = await ProductionPlanning.findByPk(item.id);

        if (!planning) {
          return res.status(404).json({
            message: `Production Planning with ID ${item.id} not found`
          });
        }

        const planningUpdates = {
          equipment_id: item.equipment_id,

          material_id: item.material_id,

          quality: item.quality,

          batch_no: item.batch_no,

          work_order_no: item.work_order_no,

          labours: item.labours,
          target: item.target,
          name_of_person: item.name_of_person,

          // Date bhi update hoga
          date: date,

          user_id: req.admin.id
        };
        if (isAdmin) {
          planningUpdates.output_morning = item.output_morning;
          planningUpdates.output_evening = item.output_evening;
        }
        await planning.update(planningUpdates);

        updatedItems.push(planning);
      } else {
        /* =================================================
           NEW RECORD -> CREATE
        ================================================= */

        const newPlanning = await ProductionPlanning.create({
          equipment_id: item.equipment_id,

          material_id: item.material_id,

          quality: item.quality,

          batch_no: item.batch_no,

          work_order_no: item.work_order_no,

          labours: item.labours,
          target: item.target,
          name_of_person: item.name_of_person,

          output_morning: isAdmin ? item.output_morning : null,

          output_evening: isAdmin ? item.output_evening : null,

          date: date,

          user_id: req.admin.id
        });

        updatedItems.push(newPlanning);
      }
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      message: "Production Planning Updated Successfully",

      date,

      deletedIds,

      data: updatedItems
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roleId = Number(req.admin?.role_id);
    if (![1, 3].includes(roleId)) {
      return res.status(403).json({ message: "Only QA and Admin can delete production planning." });
    }

    if (!id) {
      return res.status(400).json({
        message: "Production Planning ID is required"
      });
    }

    const planning = await ProductionPlanning.findByPk(id);

    if (!planning) {
      return res.status(404).json({
        message: "Production Planning not found"
      });
    }

    // Same date ke saare records delete
    await ProductionPlanning.destroy({
      where: {
        date: planning.date
      }
    });

    return res.status(200).json({
      message: "Production Planning deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
