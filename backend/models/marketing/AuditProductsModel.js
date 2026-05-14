module.exports = (sequelize, DataTypes) => {
  const AuditProductsModel = sequelize.define(
    "AuditProductsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      audit_id: {
        type: DataTypes.INTEGER
      },

      product_id: {
        type: DataTypes.INTEGER
      },

      grade: {
        type: DataTypes.STRING
      },

      auditor_name: {
        type: DataTypes.STRING
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "audits_intrested_products",
      underscored: true
    }
  );

  AuditProductsModel.associate = (models) => {
    AuditProductsModel.belongsTo(models.AuditModel, {
      foreignKey: "audit_id",
      as: "audit"
    });

    AuditProductsModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });

    AuditProductsModel.belongsTo(models.User, {
      foreignKey: "auditor_name",
      as: "sales_name"
    });
  };

  return AuditProductsModel;
};
