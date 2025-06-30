module.exports = (sequelize, DataTypes) => {
  const PermissionModel = sequelize.define(
    "PermissionModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      paranoid: true,
      tableName: "permissions",
      underscored: true
    }
  );

  return PermissionModel;
};
