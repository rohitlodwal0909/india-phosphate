const { where } = require("sequelize");
const db = require("../../../models");

const {
  QuotationModel,
  GrnEntry,
  PmCode,
  RmCode,
  Equipment,
  RMIssueModel,
  PMIssueModel,
  EquipmentIssueModel,
  PoRequisitionModel,
  PoRequisitionProduct,
  PoRequisitionRawMaterial,
  PoRequisitionPackingMaterial,
  PoRequisitionEquipment,
  Product
} = db;

exports.getRemaningStock = async (req, res) => {
  try {
    /* ======================================================
       RAW MATERIAL STOCK
    ====================================================== */

    const rm = await GrnEntry.findAll({
      where: { type: "material" },
      attributes: ["id", "quantity", "unit", "store_rm_code"],
      include: [
        {
          model: RmCode,
          as: "rmcode",
          attributes: ["id", "rm_code", "name"],
          include: [
            {
              model: RMIssueModel,
              as: "issuedRawMaterial",
              attributes: ["quantity"]
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    const rmStock = rm.map((item) => {
      const grnQty = Number(item.quantity) || 0;

      const issuedQty =
        item.rmcode?.issuedRawMaterial?.reduce(
          (sum, issue) => sum + Number(issue.quantity || 0),
          0
        ) || 0;

      return {
        id: item.rmcode?.id,
        code: item.rmcode?.rm_code,
        name: item.rmcode?.name,
        unit: item.unit,
        grn_quantity: grnQty,
        issued_quantity: issuedQty,
        remaining_quantity: grnQty - issuedQty
      };
    });

    /* ======================================================
       PACKING MATERIAL STOCK
    ====================================================== */

    const pm = await GrnEntry.findAll({
      where: { type: "pm" },
      attributes: ["id", "quantity", "unit", "store_pm_code"],
      include: [
        {
          model: PmCode,
          as: "pm_code",
          attributes: ["id", "name"],
          include: [
            {
              model: PMIssueModel,
              as: "issuedPM",
              attributes: ["quantity"]
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    const pmStock = pm.map((item) => {
      const grnQty = Number(item.quantity) || 0;

      const issuedQty =
        item.PmCode?.issuedPM?.reduce(
          (sum, issue) => sum + Number(issue.quantity || 0),
          0
        ) || 0;

      return {
        id: item.pm_code?.id,
        name: item.pm_code?.name,
        unit: item.unit,
        grn_quantity: grnQty,
        issued_quantity: issuedQty,
        remaining_quantity: grnQty - issuedQty
      };
    });

    /* ======================================================
       EQUIPMENT STOCK
    ====================================================== */

    const equipment = await GrnEntry.findAll({
      where: { type: "equipment" },
      attributes: ["id", "quantity", "unit", "equipment"],
      include: [
        {
          model: Equipment,
          as: "equipments",
          attributes: ["id", "name"],
          include: [
            {
              model: EquipmentIssueModel,
              as: "issuedEquipments",
              attributes: ["quantity"]
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    const equipmentStock = equipment.map((item) => {
      const grnQty = Number(item.quantity) || 0;

      const issuedQty =
        item.equipments?.issuedEquipments?.reduce(
          (sum, issue) => sum + Number(issue.quantity || 0),
          0
        ) || 0;

      return {
        id: item.equipments?.id,
        name: item.equipments?.name,
        unit: item.unit,
        grn_quantity: grnQty,
        issued_quantity: issuedQty,
        remaining_quantity: grnQty - issuedQty
      };
    });

    /* ======================================================
       FINAL RESPONSE
    ====================================================== */

    return res.status(200).json({
      message: "Remaining Stock List",
      raw_material: rmStock,
      packing_material: pmStock,
      equipment: equipmentStock
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};

/* ======================================================
   CREATE QUOTATION
====================================================== */

exports.createPoRequisition = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      address,
      application,
      expected_arrival_date,
      remark,
      products,
      raw_materials,
      packing_materials,
      equipments
    } = req.body;

    /* ================= CREATE REQUISITION ================= */

    const requisition = await PoRequisitionModel.create(
      {
        user_id: req.admin.id,
        address,
        application,
        expected_arrival_date,
        remark
      },
      { transaction }
    );

    /* ================= LOOP PRODUCTS ================= */

    for (const product of products) {
      const productRow = await PoRequisitionProduct.create(
        {
          po_requisition_id: requisition.id,
          product_id: product.product_id
        },
        { transaction }
      );

      /* ================= RAW MATERIALS ================= */

      if (raw_materials?.length) {
        const rmData = raw_materials.map((rm) => ({
          po_requisition_id: requisition.id,
          rm_id: rm.rm_id,
          qty: rm.qty,
          unit: rm.unit
        }));

        await PoRequisitionRawMaterial.bulkCreate(rmData, {
          transaction
        });
      }

      /* ================= PACKING MATERIAL ================= */

      if (packing_materials?.length) {
        const pmData = packing_materials.map((pm) => ({
          po_requisition_id: requisition.id,
          pm_id: pm.pm_id,
          qty: pm.qty,
          unit: pm.unit
        }));

        await PoRequisitionPackingMaterial.bulkCreate(pmData, {
          transaction
        });
      }

      /* ================= EQUIPMENT ================= */

      if (equipments?.length) {
        const eqData = equipments.map((eq) => ({
          po_requisition_id: requisition.id,
          equipment_id: eq.equipment_id,
          qty: eq.qty,
          unit: eq.unit
        }));

        await PoRequisitionEquipment.bulkCreate(eqData, {
          transaction
        });
      }
    }

    /* ================= COMMIT ================= */

    await transaction.commit();

    console.log(req.body);
    return;

    return res.status(200).json({
      success: true,
      message: "PO Requisition Created Successfully",
      id: requisition.id
    });
  } catch (error) {
    await transaction.rollback();

    console.error("CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Creation Failed"
    });
  }
};

/* ======================================================
   UPDATE QUOTATION
====================================================== */
/* ======================================================
   UPDATE PO REQUISITION
====================================================== */
exports.updatePoRequisition = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      address,
      application,
      expected_arrival_date,
      remark,
      products,
      raw_materials,
      packing_materials,
      equipments
    } = req.body;

    /* ================= FIND ================= */

    const requisition = await PoRequisitionModel.findByPk(id);

    if (!requisition) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Requisition not found"
      });
    }

    /* ================= UPDATE MAIN ================= */

    await requisition.update(
      {
        user_id: req.admin.id,
        address,
        application,
        expected_arrival_date,
        remark
      },
      { transaction }
    );

    /* ================= DELETE OLD CHILD DATA ================= */

    await PoRequisitionProduct.destroy({
      where: { po_requisition_id: id },
      transaction
    });

    await PoRequisitionRawMaterial.destroy({
      where: { po_requisition_id: id },
      transaction
    });

    await PoRequisitionPackingMaterial.destroy({
      where: { po_requisition_id: id },
      transaction
    });

    await PoRequisitionEquipment.destroy({
      where: { po_requisition_id: id },
      transaction
    });

    /* ================= RECREATE PRODUCTS ================= */

    if (products?.length) {
      const productData = products.map((p) => ({
        po_requisition_id: id,
        product_id: p.product_id
      }));

      await PoRequisitionProduct.bulkCreate(productData, {
        transaction
      });
    }

    /* ================= RECREATE RM ================= */

    if (raw_materials?.length) {
      const rmData = raw_materials.map((rm) => ({
        po_requisition_id: id,
        rm_id: rm.rm_id,
        qty: rm.qty,
        unit: rm.unit
      }));

      await PoRequisitionRawMaterial.bulkCreate(rmData, {
        transaction
      });
    }

    /* ================= RECREATE PM ================= */

    if (packing_materials?.length) {
      const pmData = packing_materials.map((pm) => ({
        po_requisition_id: id,
        pm_id: pm.pm_id,
        qty: pm.qty,
        unit: pm.unit
      }));

      await PoRequisitionPackingMaterial.bulkCreate(pmData, {
        transaction
      });
    }

    /* ================= RECREATE EQUIPMENT ================= */

    if (equipments?.length) {
      const eqData = equipments.map((eq) => ({
        po_requisition_id: id,
        equipment_id: eq.equipment_id,
        qty: eq.qty,
        unit: eq.unit
      }));

      await PoRequisitionEquipment.bulkCreate(eqData, {
        transaction
      });
    }

    /* ================= COMMIT ================= */

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "PO Requisition Updated Successfully"
    });
  } catch (error) {
    await transaction.rollback();

    console.error("UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Update Failed"
    });
  }
};

/* ======================================================
   GET ALL QUOTATION
====================================================== */
/* ======================================================
   GET ALL PO REQUISITION
====================================================== */
exports.getPoRequisition = async (req, res) => {
  try {
    const data = await PoRequisitionModel.findAll({
      order: [["id", "DESC"]],

      include: [
        {
          model: PoRequisitionProduct,
          as: "products",
          include: [
            {
              model: Product,
              attributes: ["id", "product_name"]
            }
          ]
        },

        {
          model: PoRequisitionRawMaterial,
          as: "raw_materials",
          include: [
            {
              model: RmCode,
              attributes: ["id", "rm_code"]
            }
          ]
        },

        {
          model: PoRequisitionPackingMaterial,
          as: "packing_materials",
          include: [
            {
              model: PmCode,
              attributes: ["id", "name"]
            }
          ]
        },

        {
          model: PoRequisitionEquipment,
          as: "equipments",
          include: [
            {
              model: Equipment,
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "PO Requisition list",
      data
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   DELETE QUOTATION
====================================================== */
/* ======================================================
   DELETE PO REQUISITION
====================================================== */
exports.deletePoRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await PoRequisitionModel.findByPk(id);

    if (!requisition) {
      return res.status(404).json({
        message: "Requisition not found"
      });
    }

    await requisition.destroy();

    return res.status(200).json({
      message: "PO Requisition deleted successfully",
      id
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};
