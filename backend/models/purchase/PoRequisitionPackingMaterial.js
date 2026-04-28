module.exports = (sequelize, DataTypes) => {
  const PoRequisitionPackingMaterial = sequelize.define(
    "PoRequisitionPackingMaterial",
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

      pm_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      qty: DataTypes.DECIMAL(10, 2),

      unit: DataTypes.STRING(50)
    },
    {
      tableName: "po_requisition_packing_materials",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  PoRequisitionPackingMaterial.associate = (models) => {
    PoRequisitionPackingMaterial.belongsTo(models.PoRequisitionModel, {
      foreignKey: "po_requisition_id"
    });

    PoRequisitionPackingMaterial.belongsTo(models.PmCode, {
      foreignKey: "pm_id"
    });
  };

  return PoRequisitionPackingMaterial;
};
