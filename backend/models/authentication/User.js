module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "blocked"),
        allowNull: false,
        defaultValue: "active"
      },
     phone:{
        type: DataTypes.STRING,
        allowNull: true
      },
       address:{
        type: DataTypes.STRING,
        allowNull: true
      },
      profile_image:{
        type: DataTypes.STRING,
      
      },
      gender:{
         type: DataTypes.STRING,
        allowNull: true
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
      tableName: "users",
      underscored: true
    }
  );

  User.associate = (models) => {
    User.hasMany(models.RawMaterialQcResult, {
      foreignKey: "tested_by",
      as: "testedBy"
    });
  };

  return User;
};
