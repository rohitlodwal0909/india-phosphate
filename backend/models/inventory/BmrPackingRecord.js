module.exports = (sequelize, DataTypes) => {
  const BmrPackingRecord = sequelize.define(
    "BmrPackingRecord",
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

      date: {
        type: DataTypes.DATE,
        allowNull: false
      },

      time_from: {
        type: DataTypes.STRING
      },

      time_to: {
        type: DataTypes.STRING
      },

      packing_weights: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_packing_records",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrPackingRecord;
};
