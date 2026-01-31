module.exports = (sequelize, DataTypes) => {
  const BmrSieveIntegrity = sequelize.define(
    "BmrSieveIntegrity",
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

      sieve_status: {
        type: DataTypes.STRING
      },
      grills: {
        type: DataTypes.STRING
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
      tableName: "bmr_sieve_integrity_records",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrSieveIntegrity;
};
