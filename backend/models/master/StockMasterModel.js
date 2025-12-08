// models/StockMaster.js

module.exports = (sequelize, DataTypes) => {
  const StockMaster = sequelize.define(
    "StockMaster",
    {
      stock_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "Raw Material / Packing Material / Finished Good / Equipment"
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      item_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      item_code: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      batch_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      purchase_number: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      material_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      gst_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      uom: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      quantity_in_stock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      minimum_stock_level: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      reorder_level: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rack_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      last_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      last_updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Active",
        comment: "Active / Inactive / Expired / Used"
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "stock_master",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true
    }
  );

  return StockMaster;
};
