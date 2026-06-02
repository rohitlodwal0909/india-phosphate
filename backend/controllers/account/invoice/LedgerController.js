const { where, fn, col } = require("sequelize");
const db = require("../../../models");
const {
  PurchaseOrderModel,
  Customer,
  User,
  DispatchVehicle,
  Invoice,
  InvoiceItem,
  Product,
  DispatchBatch,
  Qcbatch
} = db;
const sequelize = db.sequelize;

exports.getOverallPayment = async (req, res) => {
  try {
    const data = await Invoice.findAll({
      attributes: [
        "id",
        "payment_status",
        [fn("SUM", col("InvoiceItems.amount")), "totalAmount"]
      ],
      include: [
        {
          model: InvoiceItem,
          attributes: []
        }
      ],
      group: ["Invoice.id"],
      raw: true
    });

    const total_credit = data
      .filter((data) => data.payment_status == "Received")
      .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

    const invoice_value = data.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || 0),
      0
    );

    res.json({
      invoice_value,
      total_credit,
      data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
