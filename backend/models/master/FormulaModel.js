// models/category.model.js

module.exports = (sequelize, DataTypes) => {
  const Formula = sequelize.define("Formula", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    formula_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_type: {
      type: DataTypes.STRING,
    },
    ingredients: {
      type: DataTypes.STRING,
    },
    quantity_per_batch_or_unit: {
      type: DataTypes.DECIMAL(10, 2),
    },
    uom: {
      type: DataTypes.STRING,
    },
    batch_size: {
      type: DataTypes.DECIMAL(10, 2),
    },
    quantity_per_batch_or_unit:{
        type: DataTypes.STRING,
    },
    manufacturing_instructions: {
      type: DataTypes.TEXT,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'formula_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // enables soft delete using deletedAt
    deletedAt: 'deleted_at',
  });
  return Formula;
};
