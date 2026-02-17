// models/category.model.js

module.exports = (sequelize, DataTypes) => {
  const GRNMaster = sequelize.define(
    "GRNMaster",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      financial_year: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      grn_no: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "grn_masters",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft delete using deletedAt
      deletedAt: "deleted_at"
    }
  );

  return GRNMaster;
};
