module.exports = (sequelize, DataTypes) => {
  const PoRequisitionModel = sequelize.define(
    "PoRequisitionModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      /* ================= USER ================= */
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      /* ================= PRODUCT ================= */
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      application: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      expected_arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      remark: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      /* ================= RM ================= */
      rm_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      rm_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      rm_unit: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      /* ================= PM ================= */
      pm_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      pm_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      pm_unit: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      /* ================= EQUIPMENT ================= */
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      equipment_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      equipment_unit: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      tableName: "po_requisitions",

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",

      paranoid: true
    }
  );

  PoRequisitionModel.associate = (models) => {
    PoRequisitionModel.belongsTo(models.Product, {
      foreignKey: "product_id"
    });
    PoRequisitionModel.belongsTo(models.RmCode, {
      foreignKey: "rm_id"
    });
    PoRequisitionModel.belongsTo(models.PmCode, {
      foreignKey: "pm_id"
    });
    PoRequisitionModel.belongsTo(models.Equipment, {
      foreignKey: "equipment_id"
    });
  };

  return PoRequisitionModel;
};
