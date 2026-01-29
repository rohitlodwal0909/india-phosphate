module.exports = (sequelize, DataTypes) => {
  const LineClearance = sequelize.define(
    "LineClearance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      bmr_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      clearance_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      bmr_product_id: {
        type: DataTypes.INTEGER
      },

      cleaning_by: {
        type: DataTypes.STRING // staff id
      },

      checked_by: {
        type: DataTypes.STRING // QA staff id
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending"
      }
    },
    {
      tableName: "line_clearances",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  LineClearance.associate = (models) => {
    LineClearance.hasMany(models.LineClearanceKeyPoint, {
      foreignKey: "line_clearance_id",
      as: "key_points"
    });
  };

  return LineClearance;
};
