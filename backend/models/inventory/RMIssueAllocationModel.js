module.exports = (sequelize, DataTypes) => sequelize.define(
  "RMIssueAllocation",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    issue_id: { type: DataTypes.INTEGER, allowNull: false },
    grn_entry_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 3), allowNull: false }
  },
  { tableName: "rm_issue_allocations", timestamps: true, underscored: true }
);
