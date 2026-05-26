module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define(
    "Grade",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      grade: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "grades",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft delete using deleted_at
      deletedAt: "deleted_at"
    }
  );

  return Grade;
};
