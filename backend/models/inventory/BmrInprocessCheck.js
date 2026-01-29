module.exports = (sequelize, DataTypes) => {
  const BmrInprocessCheck = sequelize.define(
    "BmrInprocessCheck",
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
        type: DataTypes.DATEONLY
      },

      key_points: {
        type: DataTypes.STRING
      },

      records: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_inprocess_checks",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrInprocessCheck;
};
