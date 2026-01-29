module.exports = (sequelize, DataTypes) => {
  const BmrPMIssuance = sequelize.define(
    "BmrPMIssuance",
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
      pm_id: {
        type: DataTypes.STRING
      },

      bmr_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      received_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      issued_by: {
        type: DataTypes.INTEGER
      },

      actual_qty: {
        type: DataTypes.STRING
      },

      qc_reference: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_pm_issuances",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrPMIssuance;
};
