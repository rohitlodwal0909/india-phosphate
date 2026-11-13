module.exports = (sequelize, DataTypes) => {
  const InvoicePaymentFollowup = sequelize.define(
    "InvoicePaymentFollowup",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      invoice_id: { type: DataTypes.INTEGER, allowNull: false },
      note: { type: DataTypes.TEXT, allowNull: false },
      follow_up_date: { type: DataTypes.DATEONLY, allowNull: false }
    },
    { tableName: "invoice_payment_followups", timestamps: true, underscored: true }
  );

  InvoicePaymentFollowup.associate = (models) => {
    InvoicePaymentFollowup.belongsTo(models.Invoice, { foreignKey: "invoice_id" });
  };

  return InvoicePaymentFollowup;
};
