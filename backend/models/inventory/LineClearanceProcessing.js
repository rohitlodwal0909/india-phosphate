module.exports = (sequelize, DataTypes) => {
  const LineClearanceProcessing = sequelize.define(
    "LineClearanceProcessing",
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

      previous_product: {
        type: DataTypes.STRING
      },

      key_points: {
        type: DataTypes.STRING
      },

      equipments: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_line_clearance_processing",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return LineClearanceProcessing;
};
