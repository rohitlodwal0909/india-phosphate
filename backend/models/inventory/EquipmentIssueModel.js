module.exports = (sequelize, DataTypes) => {
  const EquipmentIssueModel = sequelize.define(
    "EquipmentIssueModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      equipment_id: {
        type: DataTypes.INTEGER
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      person_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "equipment_issue_records",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  EquipmentIssueModel.associate = (models) => {
    EquipmentIssueModel.belongsTo(models.Equipment, {
      foreignKey: "equipment_id",
      as: "issueequipment"
    });
  };

  return EquipmentIssueModel;
};
