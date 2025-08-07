module.exports = (sequelize, DataTypes) => {
  const Outword = sequelize.define(
    "Outword",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      outword_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      outword_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
        created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item: {
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
      purpose: {
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
      tableName: "outwords",
      timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at"
    }
  );
 return Outword
}