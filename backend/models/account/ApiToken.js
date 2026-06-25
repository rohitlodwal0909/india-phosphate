module.exports = (sequelize, DataTypes) => {
  const ApiToken = sequelize.define(
    "ApiToken",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "api_tokens",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return ApiToken;
};
