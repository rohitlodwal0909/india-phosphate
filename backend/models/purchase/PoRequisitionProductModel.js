module.exports = (sequelize, DataTypes) => {
  const PoRequisitionProduct = sequelize.define(
    "PoRequisitionProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      po_requisition_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "po_requisition_products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  PoRequisitionProduct.associate = (models) => {
    PoRequisitionProduct.belongsTo(models.PoRequisitionModel, {
      foreignKey: "po_requisition_id"
    });

    PoRequisitionProduct.belongsTo(models.Product, {
      foreignKey: "product_id"
    });
  };

  return PoRequisitionProduct;
};
