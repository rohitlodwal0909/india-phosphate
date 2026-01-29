module.exports = (sequelize, DataTypes) => {
  const BmrEquipmentList = sequelize.define(
    "BmrEquipmentList",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      bmr_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      equipment_no: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_equipmentId_numbers",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrEquipmentList;
};
