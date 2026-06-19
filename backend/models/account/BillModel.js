module.exports = (sequelize, DataTypes) => {
  const BillModel = sequelize.define(
    "BillModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      company_id: {
        type: DataTypes.INTEGER
      },
      party_type: {
        type: DataTypes.STRING
      },
      transaction_type: {
        type: DataTypes.STRING
      },

      // 🔹 Basic
      po_no: DataTypes.STRING,
      invoice_type: DataTypes.STRING,
      invoice_no: DataTypes.STRING,
      invoice_date: DataTypes.DATE,
      eway_bill: DataTypes.STRING,
      oq_upload: DataTypes.STRING,
      delivery_note: DataTypes.STRING,
      grade: DataTypes.STRING,
      delivery_note_date: DataTypes.DATE,

      // 🔹 IRN
      irn: DataTypes.STRING,
      ack_no: DataTypes.STRING,
      ack_date: DataTypes.DATE,

      // 🔹 Party
      buyer: DataTypes.TEXT,
      consignee: DataTypes.TEXT,
      gst_type: DataTypes.STRING,

      // 🔹 Payment
      payment_mode: DataTypes.STRING,
      payment_remark: DataTypes.TEXT,

      // 🔹 References
      reference_no: DataTypes.STRING,
      other_reference: DataTypes.STRING,
      buyer_order_no: DataTypes.STRING,
      buyer_order_date: DataTypes.DATE,

      // 🔹 Dispatch
      dispatch_doc_no: DataTypes.STRING,
      dispatch_through: DataTypes.STRING,
      destination: DataTypes.STRING,
      country: DataTypes.STRING,

      // 🔹 Export
      lut_no: DataTypes.STRING,
      from_to: DataTypes.STRING,

      freight: DataTypes.STRING,
      round_off: DataTypes.STRING,
      insurance: DataTypes.STRING,

      // 🔹 GST
      gst: DataTypes.STRING,
      payment_date: DataTypes.STRING,

      // 🔹 Other
      terms_delivery: DataTypes.TEXT,
      remark: DataTypes.TEXT,
      eway_pdf: DataTypes.STRING,
      payment_status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending"
      },
      account_payment_remark: DataTypes.TEXT,

      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "bills",
      timestamps: true,
      paranoid: true, // soft delete
      underscored: true
    }
  );

  BillModel.associate = (models) => {
    BillModel.hasMany(models.BillModelItem, {
      foreignKey: "bill_id"
    });
    BillModel.belongsTo(models.Customer, {
      foreignKey: "company_id"
    });
    BillModel.belongsTo(models.Supplier, {
      foreignKey: "company_id"
    });
  };

  return BillModel;
};
