// models/category.model.js

module.exports = (sequelize, DataTypes) => {
  const FinishGood  = sequelize.define("FinishGood", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
       product_code: {
    type: DataTypes.STRING(50),
  },
  product_name: {
    type: DataTypes.STRING(255),
  },
  product_description: {
    type: DataTypes.TEXT,
  },
  batch_size: {
    type: DataTypes.STRING(100),
  },
  unit_of_measure: {
    type: DataTypes.STRING(50),
  },
  packing_details: {
    type: DataTypes.STRING(255),
  },
  hsn_code: {
    type: DataTypes.STRING(20),
  },
  gst_rate: {
    type: DataTypes.DECIMAL(5, 2),
  },
  shelf_life: {
    type: DataTypes.STRING(50),
  },
  storage_condition: {
    type: DataTypes.STRING(255),
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
  },
  created_by: {
    type: DataTypes.STRING(100),
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
  }, {
    tableName: 'finish_good',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // enables soft delete using deletedAt
    deletedAt: 'deleted_at',
  });

  return FinishGood;
};
