module.exports = (sequelize, DataTypes) => {
  const LineClearanceKeyPoint = sequelize.define(
    "LineClearanceKeyPoint",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      line_clearance_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      key_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      cleaning_status: {
        type: DataTypes.ENUM("Yes", "No", "NA")
      },

      checked_status: {
        type: DataTypes.ENUM("Yes", "No", "NA")
      }
    },
    {
      tableName: "line_clearance_key_points",
      timestamps: true,
      underscored: true
    }
  );

  LineClearanceKeyPoint.associate = (models) => {
    LineClearanceKeyPoint.belongsTo(models.LineClearance, {
      foreignKey: "line_clearance_id",
      as: "line_clearance"
    });
  };

  return LineClearanceKeyPoint;
};
