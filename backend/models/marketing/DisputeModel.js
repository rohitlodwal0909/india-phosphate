module.exports = (sequelize, DataTypes) => {
  const DisputeModel = sequelize.define(
    "DisputeModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      dispute_type: {
        type: DataTypes.STRING
      },

      dispute_type_id: {
        type: DataTypes.STRING
      },

      dispute_reason: {
        type: DataTypes.STRING
      },
      assigned_to: {
        type: DataTypes.STRING
      },

      priority: {
        type: DataTypes.STRING
      },

      followups: {
        type: DataTypes.TEXT
      },

      date: {
        type: DataTypes.DATEONLY
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
      tableName: "disputes",
      underscored: true
    }
  );

  DisputeModel.associate = (models) => {
    DisputeModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
    DisputeModel.belongsTo(models.User, {
      foreignKey: "assigned_to",
      sourceKey: "id",
      as: "assign_to"
    });
    DisputeModel.belongsTo(models.PurchaseOrderModel, {
      foreignKey: "dispute_type_id",
      targetKey: "id",
      constraints: false,
      as: "purchase_order"
    });

    /* ================= SAMPLE REQUEST ================= */

    DisputeModel.belongsTo(models.SampleRequestModel, {
      foreignKey: "dispute_type_id",
      targetKey: "id",
      constraints: false,
      as: "sample_request"
    });
  };

  return DisputeModel;
};
