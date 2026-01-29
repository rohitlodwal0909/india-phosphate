module.exports = (sequelize, DataTypes) => {
  const BmrQcIntimation = sequelize.define(
    "BmrQcIntimation",
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

      sample_by: {
        type: DataTypes.STRING,
        allowNull: false
      },

      date: {
        type: DataTypes.STRING
      },

      quantity_sampled: {
        type: DataTypes.STRING
      },

      checked_by: {
        type: DataTypes.STRING
      },

      results: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_qc_intimations",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrQcIntimation;
};
