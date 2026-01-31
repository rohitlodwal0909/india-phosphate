module.exports = (sequelize, DataTypes) => {
  const BmrManufacturingProcedure = sequelize.define(
    "BmrManufacturingProcedure",
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

      actual_qty: {
        type: DataTypes.STRING
      },

      checked_by: {
        type: DataTypes.INTEGER
      },
      done_by: {
        type: DataTypes.INTEGER
      },

      ph: {
        type: DataTypes.STRING
      },

      sp_gravity: {
        type: DataTypes.STRING
      },
      step_id: {
        type: DataTypes.INTEGER
      },
      temp: {
        type: DataTypes.STRING
      },
      time_from: {
        type: DataTypes.STRING
      },
      time_to: {
        type: DataTypes.STRING
      },
      value: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_manufacturing_procedures",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrManufacturingProcedure;
};
