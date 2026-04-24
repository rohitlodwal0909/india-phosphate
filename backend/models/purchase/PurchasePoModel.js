module.exports = (sequelize, DataTypes) => {
  const PurchasePoModel = sequelize.define(
    "PurchasePoModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      po_no: {
        type: DataTypes.STRING,
        allowNull: false
      },

      date: {
        type: DataTypes.STRING,
        allowNull: false
      },

      shipping_term: {
        type: DataTypes.STRING,
        allowNull: false
      },

      payment_term: {
        type: DataTypes.STRING,
        allowNull: false
      },

      destination: {
        type: DataTypes.STRING,
        allowNull: false
      },

      products: {
        type: DataTypes.TEXT, // ✅ important
        allowNull: false
      },

      bill_to: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      expected_arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: "po_purchase", // ✅ final name
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true
    }
  );

  return PurchasePoModel;
};
