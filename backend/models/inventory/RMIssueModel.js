module.exports = (sequelize, DataTypes) => {
  const RMIssueModel = sequelize.define(
    "RMIssueModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      rm_id: {
        type: DataTypes.INTEGER
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      person_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      batch_no: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
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
      tableName: "rm_issue_records",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  RMIssueModel.associate = (models) => {
    RMIssueModel.belongsTo(models.RmCode, {
      foreignKey: "rm_id",
      as: "issueRm"
    });
  };

  return RMIssueModel;
};
