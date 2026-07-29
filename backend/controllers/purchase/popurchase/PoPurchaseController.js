const { where } = require("sequelize");
const db = require("../../../models");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");

const {
  PmCode,
  RmCode,
  Equipment,
  PoRequisitionModel,
  Product,
  PurchasePoModel,
  PurchasePoProductsModel,
  PackingMaterial
} = db;

/* ======================================================
   CREATE QUOTATION
====================================================== */

exports.createPoPurchase = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const products = req.body.products || [];

    // console.log(products);

    // return;

    const po = await PurchasePoModel.create(
      {
        user_id: req.admin.id,
        po_no: req.body.po_no,
        bill_to: req.body.bill_to,
        delivery_address: req.body.delivery_address,
        date: req.body.date,
        expected_arrival_date: req.body.expected_arrival_date,
        shipping_term: req.body.shipping_term,
        payment_term: req.body.payment_term,
        destination: req.body.destination
      },
      { transaction }
    );

    if (products && products.length > 0) {
      const productData = products.map((item) => ({
        purchase_po_id: po.id,
        packing_id: item.packing_id,
        product_id: item.product_id,
        qty: item.qty,
        rate: item.rate,
        discount_rate: item.discount_rate || 0,
        gst: item.gst || 0,
        amount: item.amount,
        unit: item.unit,
        currency: item.currency || "INR",
        gst_amount: item.gst_amount || 0,
        total: item.total
      }));

      await PurchasePoProductsModel.bulkCreate(productData, {
        transaction
      });
    }

    await transaction.commit();

    return res.status(200).json({
      message: "Purchase PO created successfully",
      data: po
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Create Error:", error);

    return res.status(500).json({
      message: error.message || "PO Purchase creation failed"
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
      order: [["id", "DESC"]],
      include: [
        {
          model: PurchasePoProductsModel,
          as: "purchasePo",
          include: [
            {
              model: Product,
              as: "product"
            },
            {
              model: PmCode,
              as: "packing"
            }
          ]
        }
      ]
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

exports.purchasePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find Purchase Order
    const po = await PurchasePoModel.findByPk(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase PO not found"
      });
    }

    // Update Status
    await po.update({ payment_status: status });

    // Notification Message
    let title = "Purchase PO Payment Status";
    let message = "";

    if (status === "Paid") {
      message = `Purchase ${po.po_no} Payment has been paid.`;
    } else if (status === "Notpaid") {
      message = `Purchase PO ${po.po_no} Payment has been not paid.`;
    } else {
      message = `Purchase PO ${po.po_no} Payment status updated to ${status}.`;
    }

    // Create Notification
    await createNotificationByRoleId({
      title,
      message,
      link: "accounts/purchase",
      role_id: 11,
      module_id: 6,
      submodule_id: 3
    });

    return res.status(200).json({
      success: true,
      message: `Purchase PO Payment ${status} successfully`
    });
  } catch (error) {
    console.error("payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.purchaseAddRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    // Find Purchase Order
    const po = await PurchasePoModel.findByPk(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase PO not found"
      });
    }

    // Update Status
    await po.update({ purchase_remark: remark });

    return res.status(200).json({
      success: true,
      message: `Purchase PO add remark successfully`
    });
  } catch (error) {
    console.error("payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
