module.exports = (sequelize, DataTypes) => sequelize.define(
  "RMProductionReturn",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    grn_entry_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    production_batch: { type: DataTypes.STRING(100), allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true }
  },
  { tableName: "rm_production_returns", timestamps: true, underscored: true }
);
