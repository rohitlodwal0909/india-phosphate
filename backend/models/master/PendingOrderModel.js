// models/PendingOrder.js

module.exports = (sequelize, DataTypes) => {
  const PendingOrder = sequelize.define(
    'PendingOrder',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      customer_name_or_id: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      expected_delivery_date: {
        type: DataTypes.DATEONLY,
      },
      products_ordered: {
        type: DataTypes.TEXT, // stored as string, can parse as JSON in app
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity_delivered: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      quantity_pending:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      remarks: {
        type: DataTypes.TEXT,
      },
      order_status: {
        type: DataTypes.ENUM('Pending', 'Partially Delivered', 'Completed'),
        defaultValue: 'Pending',
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'pending_order',
      timestamps: true, // adds createdAt and updatedAt
      paranoid: true,   // enables soft delete (uses deleted_at)
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  return PendingOrder;
};
