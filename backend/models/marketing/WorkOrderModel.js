module.exports = (sequelize, DataTypes) => {
  const WorkOrderModel = sequelize.define(
    "WorkOrderModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      po_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      work_order_no: {
        type: DataTypes.STRING
      },

      date: {
        type: DataTypes.DATEONLY
      },

      remark: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
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
      tableName: "work_orders",
      underscored: true
    }
  );

  WorkOrderModel.associate = (models) => {
    WorkOrderModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
    WorkOrderModel.belongsTo(models.PurchaseOrderModel, {
      foreignKey: "po_id",
      as: "workNo"
    });
  };

  return WorkOrderModel;
};
