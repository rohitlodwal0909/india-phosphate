const { getISTDateTime } = require("../../../helper/dateTimeHelper");
const db = require("../../../models");

const { PurchaseStoreModel } = db;

/* ======================================================
   CREATE QUOTATION
====================================================== */
exports.create = async (req, res) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    const data = await PurchaseStoreModel.create({
      ...req.body,
      user_id: req.admin.id,
      date: entry_date + entry_time
    });

    res.json({
      success: true,
      message: "Transport Entry Created",
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { id } = req.body;

    const record = await PurchaseStoreModel.findOne({
      where: { id }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Transport Entry Not Found"
      });
    }

    await record.update({
      ...req.body
    });

    res.json({
      success: true,
      message: "Transport Entry Updated",
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
