module.exports = (sequelize, DataTypes) => {
  const BmrYieldCalculation = sequelize.define(
    "BmrYieldCalculation",
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

      total_qty: {
        type: DataTypes.NUMBER,
        allowNull: false
      },

      theoretical_yield: {
        type: DataTypes.NUMBER
      },

      actual_yield: {
        type: DataTypes.NUMBER
      },

      remark: {
        type: DataTypes.STRING
      },
      performed_by: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "bmr_yield_calculations",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrYieldCalculation;
};
