module.exports = (sequelize, DataTypes) => {
  const AuditModel = sequelize.define(
    "AuditModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      company_id: {
        type: DataTypes.INTEGER
      },

      compliance_status: {
        type: DataTypes.STRING
      },

      compliance_remark: {
        type: DataTypes.TEXT
      },

      audit_agenda: {
        type: DataTypes.TEXT
      },

      arrival_date: {
        type: DataTypes.DATEONLY
      },

      note: {
        type: DataTypes.TEXT
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
      tableName: "audits",
      underscored: true
    }
  );

  AuditModel.associate = (models) => {
    AuditModel.hasMany(models.AuditProductsModel, {
      foreignKey: "audit_id",
      as: "interested_products"
    });
    AuditModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });
    AuditModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return AuditModel;
};
