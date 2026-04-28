module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      dispatch_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      // 🔹 Basic
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

      // 🔹 Other
      terms_delivery: DataTypes.TEXT,
      remark: DataTypes.TEXT,
      eway_pdf: DataTypes.STRING,

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
      tableName: "invoices",
      timestamps: true,
      paranoid: true, // soft delete
      underscored: true
    }
  );

  Invoice.associate = (models) => {
    Invoice.hasMany(models.InvoiceItem, {
      foreignKey: "invoice_id"
    });
    Invoice.belongsTo(models.DispatchVehicle, {
      foreignKey: "dispatch_id"
    });
  };

  return Invoice;
};
