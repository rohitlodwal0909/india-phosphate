module.exports = (sequelize, DataTypes) => {
  const TaskModel = sequelize.define(
    "TaskModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      // Task Created By
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      // Task Title
      task_title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // Assigned User
      assign_to: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      // Priority => Low | Medium | High | Urgent
      priority: {
        type: DataTypes.ENUM("Low", "Medium", "High", "Urgent"),
        allowNull: false,
        defaultValue: "Medium"
      },

      // Due Date
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      // Description
      task_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      // Status
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "In Progress",
          "Completed",
          "Hold",
          "Cancelled"
        ),
        defaultValue: "Pending"
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
      tableName: "tasks",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  TaskModel.associate = (models) => {
    // Created By User
    TaskModel.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id",
      as: "users"
    });

    // Assigned User
    TaskModel.belongsTo(models.User, {
      foreignKey: "assign_to",
      targetKey: "id",
      as: "assign_task"
    });
  };

  return TaskModel;
};
