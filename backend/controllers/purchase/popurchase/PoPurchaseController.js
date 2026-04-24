const { where } = require("sequelize");
const db = require("../../../models");

const {
  PmCode,
  RmCode,
  Equipment,
  PoRequisitionModel,
  Product,
  PurchasePoModel
} = db;

/* ======================================================
   CREATE QUOTATION
====================================================== */

exports.createPoPurchase = async (req, res) => {
  try {
    const data = await PurchasePoModel.create({
      user_id: req.admin.id,
      po_no: req.body.po_no,
      bill_to: req.body.bill_to,
      date: req.body.date,
      expected_arrival_date: req.body.expected_arrival_date,
      shipping_term: req.body.shipping_term,
      payment_term: req.body.payment_term,
      destination: req.body.destination,

      // ✅ FIX HERE
      products: JSON.stringify(req.body.products)
    });

    return res.status(200).json({
      message: "Purchase PO created successfully",
      data
    });
  } catch (error) {
    console.error("Create Error:", error);

    return res.status(500).json({
      message: "PO Purchase creation failed"
    });
  }
};

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

exports.getPurchasePo = async (req, res) => {
  try {
    const data = await PurchasePoModel.findAll({
      order: [["id", "DESC"]]
    });

    return res.status(200).json({
      message: "PO Purchase list",
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

exports.deletePoRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await PurchasePoModel.findByPk(id);

    if (!purchase) {
      return res.status(404).json({
        message: "PO Purchase not found"
      });
    }

    await purchase.destroy();

    return res.status(200).json({
      message: "PO Purchase deleted successfully",
      id
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};
