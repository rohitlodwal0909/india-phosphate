module.exports = (sequelize, DataTypes) => {
  const Inward = sequelize.define(
    "Inward",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      inward_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      inward_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      uom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      vehicle_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "inward",
      timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at"
    }
  );

  return Inward;
};