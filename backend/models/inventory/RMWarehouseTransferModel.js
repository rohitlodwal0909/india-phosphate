module.exports = (sequelize, DataTypes) => sequelize.define(
  "RMWarehouseTransfer",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    grn_entry_id: { type: DataTypes.INTEGER, allowNull: false },
    stock_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true }
  },
  { tableName: "rm_warehouse_transfers", timestamps: true, underscored: true }
);
