// models/packing_material.js

module.exports = (sequelize, DataTypes) => {
  const PackingMaterial = sequelize.define('PackingMaterial', {
    pm_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_name: {
      type: DataTypes.STRING,
    },
    material_code: {
      type: DataTypes.STRING,
    },
    material_type: {
      type: DataTypes.ENUM('Primary', 'Secondary'),
    },
    supplier_id: {
      type: DataTypes.INTEGER,
    },
    unit_of_measurement: {
      type:DataTypes.STRING,
    }, 
    purchase_rate: {
      type: DataTypes.DECIMAL(10, 2),
    },
    current_stock: {
     type:DataTypes.STRING,
    },
    stock_quantity: {
      type: DataTypes.DECIMAL(10, 2),
    },
    min_required_stock: {
      type: DataTypes.DECIMAL(10, 2),
    },
    hsn_code: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
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
  tableName: 'packing_material',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
});

  return PackingMaterial;
};
