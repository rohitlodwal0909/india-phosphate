module.exports = (sequelize, DataTypes) => {
  const VisitPlannerModel = sequelize.define(
    "VisitPlannerModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      ai_preparation_brief: {
        type: DataTypes.TEXT
      },

      date: {
        type: DataTypes.DATE
      },

      total_visits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "visit_planners",
      underscored: true
    }
  );

  VisitPlannerModel.associate = (models) => {
    VisitPlannerModel.hasMany(models.VisitPlannerDetail, {
      foreignKey: "visit_planner_id",
      as: "visits"
    });

    VisitPlannerModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return VisitPlannerModel;
};
