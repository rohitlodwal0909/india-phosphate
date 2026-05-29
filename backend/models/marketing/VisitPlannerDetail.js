module.exports = (sequelize, DataTypes) => {
  const VisitPlannerDetail = sequelize.define(
    "VisitPlannerDetail",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      visit_planner_id: {
        type: DataTypes.INTEGER
      },

      customer_id: {
        type: DataTypes.INTEGER
      },

      sales_person_id: {
        type: DataTypes.INTEGER
      },

      address: {
        type: DataTypes.TEXT
      },

      latitude: {
        type: DataTypes.STRING
      },

      longitude: {
        type: DataTypes.STRING
      },

      visit_order: {
        type: DataTypes.INTEGER
      },

      visit_date: {
        type: DataTypes.DATEONLY
      },

      priority: {
        type: DataTypes.STRING
      },

      meeting_purpose: {
        type: DataTypes.TEXT
      },

      agenda: {
        type: DataTypes.TEXT
      },

      discussion_notes: {
        type: DataTypes.TEXT
      },

      productivity: {
        type: DataTypes.TEXT
      },

      next_action: {
        type: DataTypes.TEXT
      },

      followup_date: {
        type: DataTypes.DATEONLY
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "planned"
      },

      file: {
        type: DataTypes.STRING
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "visit_planner_details",
      underscored: true
    }
  );

  VisitPlannerDetail.associate = (models) => {
    VisitPlannerDetail.belongsTo(models.VisitPlannerModel, {
      foreignKey: "visit_planner_id",
      as: "planner"
    });

    VisitPlannerDetail.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      sourceKey: "id",
      as: "customer"
    });
    VisitPlannerDetail.belongsTo(models.User, {
      foreignKey: "sales_person_id",
      sourceKey: "id",
      as: "sales_person"
    });
  };

  return VisitPlannerDetail;
};
