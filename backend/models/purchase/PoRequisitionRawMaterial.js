module.exports = (sequelize, DataTypes) => {
  const PoRequisitionRawMaterial = sequelize.define(
    "PoRequisitionRawMaterial",
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

      rm_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      qty: DataTypes.DECIMAL(10, 2),

      unit: DataTypes.STRING(50)
    },
    {
      tableName: "po_requisition_raw_materials",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  PoRequisitionRawMaterial.associate = (models) => {
    PoRequisitionRawMaterial.belongsTo(models.PoRequisitionModel, {
      foreignKey: "po_requisition_id"
    });

    PoRequisitionRawMaterial.belongsTo(models.RmCode, {
      foreignKey: "rm_id"
    });
  };

  return PoRequisitionRawMaterial;
};
