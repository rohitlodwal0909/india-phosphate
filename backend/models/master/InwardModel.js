module.exports = (sequelize, DataTypes) => {
  const Inward = sequelize.define(
    "Inward",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inward_number: {
        type: DataTypes.STRING,
        allowNull: false,
       
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "inward",
      timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at",
    }
  );

  return Inward;
};