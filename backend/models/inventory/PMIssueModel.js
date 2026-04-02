module.exports = (sequelize, DataTypes) => {
  const PMIssueModel = sequelize.define(
    "PMIssueModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      pm_id: {
        type: DataTypes.INTEGER
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      issued_bag: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      person_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ref_no: {
        type: DataTypes.STRING,
        allowNull: false
      },
      return_bag: {
        type: DataTypes.STRING
      },
      returned_by: {
        type: DataTypes.STRING
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
      tableName: "pm_issue_records",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  PMIssueModel.associate = (models) => {
    PMIssueModel.belongsTo(models.PmCode, {
      foreignKey: "pm_id",
      as: "issuePM"
    });

    PMIssueModel.belongsTo(models.Qcbatch, {
      foreignKey: "batch_id" // The field in ProductionResult
    });
  };

  return PMIssueModel;
};
