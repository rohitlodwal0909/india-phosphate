module.exports = (sequelize, DataTypes) => {
  const PurchasePoProductsModel = sequelize.define(
    "PurchasePoProductsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      purchase_po_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      packing_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      qty: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },

      rate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },

      discount_rate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },

      gst: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },

      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },

      unit: {
        type: DataTypes.STRING(50),
        allowNull: false
      },

      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "INR"
      },

      gst_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },

      total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      tableName: "po_purchase_products",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      underscored: true
    }
  );

  PurchasePoProductsModel.associate = (models) => {
    PurchasePoProductsModel.belongsTo(models.PurchasePoModel, {
      foreignKey: "purchase_po_id",
      sourceKey: "id",
      as: "purchasePo"
    });

    PurchasePoProductsModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      sourceKey: "id",
      as: "product"
    });

    PurchasePoProductsModel.belongsTo(models.PmCode, {
      foreignKey: "packing_id",
      sourceKey: "id",
      as: "packing"
    });
  };

  return PurchasePoProductsModel;
};
