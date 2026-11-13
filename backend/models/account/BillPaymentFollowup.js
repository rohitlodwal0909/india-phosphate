module.exports = (sequelize, DataTypes) => {
  const BillPaymentFollowup = sequelize.define(
    "BillPaymentFollowup",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      bill_id: { type: DataTypes.INTEGER, allowNull: false },
      note: { type: DataTypes.TEXT, allowNull: false },
      follow_up_date: { type: DataTypes.DATEONLY, allowNull: false }
    },
    { tableName: "bill_payment_followups", timestamps: true, underscored: true }
  );

  BillPaymentFollowup.associate = (models) => {
    BillPaymentFollowup.belongsTo(models.BillModel, { foreignKey: "bill_id" });
  };

  return BillPaymentFollowup;
};
