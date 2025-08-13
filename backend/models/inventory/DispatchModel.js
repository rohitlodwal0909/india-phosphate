module.exports = (sequelize, DataTypes) => {
  const DispatchVehicle = sequelize.define(
    "DispatchVehicle",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
      
      },
      vehicle_number: DataTypes.STRING,
      driver_details: DataTypes.STRING,
      product_name: DataTypes.STRING,
      quantity: DataTypes.STRING,
      unit: DataTypes.STRING,
      delivery_location: DataTypes.STRING,
      batch_numbers: DataTypes.JSON,
      delivered_by: DataTypes.STRING,
      invoice_number: DataTypes.STRING,
      remarks: DataTypes.TEXT,
      dispatch_date: DataTypes.DATE,
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
      tableName: "dispatch_vehicle",
      underscored: true
    }
  );

  return DispatchVehicle;
};
