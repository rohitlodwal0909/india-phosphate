module.exports = (sequelize, DataTypes) => {
  const RolePermissionModel = sequelize.define(
    "RolePermissionModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      submodule_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: false,
      paranoid: true,
      tableName: "role_permissions",
      underscored: true
    }
  );

  // Optional associations (if needed)
  RolePermissionModel.associate = (models) => {
    RolePermissionModel.belongsTo(models.RoleModel, {
      foreignKey: "role_id",
      as: "role"
    });

    RolePermissionModel.belongsTo(models.PermissionModel, {
      foreignKey: "permission_id",
      as: "permission"
    });
  };

  return RolePermissionModel;
};
