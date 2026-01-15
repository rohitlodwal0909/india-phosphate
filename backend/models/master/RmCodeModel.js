// models/rmcode.model.js

module.exports = (sequelize, DataTypes) => {
  const RmCode = sequelize.define(
    "RmCode",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      rm_code: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "rmcode",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true // for soft delete
    }
  );

  RmCode.associate = (models) => {
    RmCode.hasMany(models.GrnEntry, {
      foreignKey: "store_rm_code",
      as: "rmcodes"
    });
    RmCode.hasMany(models.RMIssueModel, {
      foreignKey: "rm_id",
      as: "issuedRawMaterial"
    });
    RmCode.hasMany(models.RawMaterial, {
      foreignKey: "rm_code",
      as: "rawMaterials"
    });
  };

  return RmCode;
};
