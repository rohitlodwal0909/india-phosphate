// models/category.model.js

module.exports = (sequelize, DataTypes) => {
  const ProductFormulaSpecification = sequelize.define(
    "ProductFormulaSpecification",
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
      formula_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      test: {
        type: DataTypes.STRING
      },
      specification: {
        type: DataTypes.STRING
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
      tableName: "product_formula_specifications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft delete using deletedAt
      deletedAt: "deleted_at"
    }
  );
  return ProductFormulaSpecification;
};
