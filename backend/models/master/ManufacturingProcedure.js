module.exports = (sequelize, DataTypes) => {
  const ManufacturingProcedure = sequelize.define(
    "ManufacturingProcedure",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      // Because we are manually handling timestamps
      tableName: "manufacturing_procedures",
      timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at"
    }
  );

  return ManufacturingProcedure;
};
