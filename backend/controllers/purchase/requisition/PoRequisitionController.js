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
  try {
    const data = await PoRequisitionModel.create({
      user_id: req.admin.id,

      product_id: req.body.product_id,
      address: req.body.address,
      application: req.body.application,
      expected_arrival_date: req.body.expected_arrival_date,
      remark: req.body.remark,

      /* RM */
      rm_id: req.body.rm_id,
      rm_qty: req.body.rm_qty,
      rm_unit: req.body.rm_unit,

      /* PM */
      pm_id: req.body.pm_id,
      pm_qty: req.body.pm_qty,
      pm_unit: req.body.pm_unit,

      /* EQUIPMENT */
      equipment_id: req.body.equipment_id,
      equipment_qty: req.body.equipment_qty,
      equipment_unit: req.body.equipment_unit
    });

    return res.status(200).json({
      message: "PO Requisition created successfully",
      data
    });
  } catch (error) {
    console.error("Create Error:", error);

    return res.status(500).json({
      message: "PO Requisition creation failed"
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
  try {
    const { id } = req.params;

    const requisition = await PoRequisitionModel.findByPk(id);

    if (!requisition) {
      return res.status(404).json({
        message: "Requisition not found"
      });
    }

    await requisition.update({
      user_id: req.admin.id,

      product_id: req.body.product_id,
      address: req.body.address,
      application: req.body.application,
      expected_arrival_date: req.body.expected_arrival_date,
      remark: req.body.remark,

      rm_id: req.body.rm_id,
      rm_qty: req.body.rm_qty,
      rm_unit: req.body.rm_unit,

      pm_id: req.body.pm_id,
      pm_qty: req.body.pm_qty,
      pm_unit: req.body.pm_unit,

      equipment_id: req.body.equipment_id,
      equipment_qty: req.body.equipment_qty,
      equipment_unit: req.body.equipment_unit
    });

    return res.status(200).json({
      message: "PO Requisition updated successfully",
      data: requisition
    });
  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      message: "Update failed"
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
          model: Product,
          attributes: ["id", "product_name"]
        },
        {
          model: RmCode,
          attributes: ["rm_code"]
        },
        {
          model: PmCode,
          attributes: ["name"]
        },
        {
          model: Equipment
        }
      ]
    });

    return res.status(200).json({
      message: "PO Requisition list",
      data
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
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
