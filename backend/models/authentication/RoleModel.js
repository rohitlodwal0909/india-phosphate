module.exports = (sequelize, DataTypes) => {
  const RoleModel = sequelize.define(
    "RoleModel",
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
      tableName: "roles",
      underscored: true
    }
  );

  return RoleModel;
};
