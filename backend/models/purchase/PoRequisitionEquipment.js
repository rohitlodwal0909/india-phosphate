module.exports = (sequelize, DataTypes) => {
  const PoRequisitionEquipment = sequelize.define(
    "PoRequisitionEquipment",
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

      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      qty: DataTypes.DECIMAL(10, 2),

      unit: DataTypes.STRING(50)
    },
    {
      tableName: "po_requisition_equipments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  PoRequisitionEquipment.associate = (models) => {
    PoRequisitionEquipment.belongsTo(models.PoRequisitionModel, {
      foreignKey: "po_requisition_id"
    });

    PoRequisitionEquipment.belongsTo(models.Equipment, {
      foreignKey: "equipment_id"
    });
  };

  return PoRequisitionEquipment;
};
