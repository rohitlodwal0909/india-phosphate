const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");

const { PurchaseStoreModel } = db;

/* ======================================================
   CREATE QUOTATION
====================================================== */
exports.create = async (req, res) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const { items, ...rest } = req.body;

    /* ================= VALIDATION ================= */
    if (!rest.po_id) {
      return res.status(400).json({
        success: false,
        message: "PO ID is required"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required"
      });
    }

    /* ================= CREATE ================= */
    const data = await PurchaseStoreModel.create({
      ...rest,
      user_id: req.admin.id,
      products: JSON.stringify(items), // store as JSON text
      date: `${entry_date} ${entry_time}`
    });

    res.status(201).json({
      success: true,
      message: "Purchase Store Created Successfully",
      data
    });
  } catch (error) {
    console.error("Purchase Store Create Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.find = async (req, res) => {
  const data = await PurchaseStoreModel.findAll({
    where: { po_id: req.params.po_id }
  });

  res.json({
    success: true,
    data
  });
};

exports.update = async (req, res) => {
  try {
    const { id, items, ...rest } = req.body;

    /* ================= VALIDATION ================= */
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required"
      });
    }

    const record = await PurchaseStoreModel.findOne({
      where: { id }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Purchase Store Not Found"
      });
    }

    /* ================= ITEMS HANDLE ================= */
    let updateData = {
      ...rest
    };

    if (items) {
      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: "Items must be an array"
        });
      }

      updateData.products = JSON.stringify(items);
    }

    /* ================= UPDATE ================= */
    await record.update(updateData);

    res.json({
      success: true,
      message: "Purchase Store Updated Successfully",
      data: record
    });
  } catch (error) {
    console.error("Purchase Store Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
