module.exports = (sequelize, DataTypes) => {
  const BmrFilterCloth = sequelize.define(
    "BmrFilterCloth",
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

      time: {
        type: DataTypes.TIME,
        allowNull: false
      },

      status_cracked: {
        type: DataTypes.STRING
      },

      status_clean: {
        type: DataTypes.STRING
      },

      date: {
        type: DataTypes.DATE
      },

      result: {
        type: DataTypes.STRING
      },

      checked_by: {
        type: DataTypes.STRING
      },

      remark: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_filter_cloth_records",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrFilterCloth;
};
