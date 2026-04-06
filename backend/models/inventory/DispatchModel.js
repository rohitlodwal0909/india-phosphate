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
        type: DataTypes.INTEGER
      },
      po_id: {
        type: DataTypes.INTEGER
      },
      vehicle_number: DataTypes.STRING,
      driver_details: DataTypes.STRING,
      product_name: DataTypes.STRING,
      lr_no: DataTypes.STRING,
      delivery_location: DataTypes.STRING,
      delivered_by: DataTypes.STRING,
      remarks: DataTypes.TEXT,
      dispatch_date: DataTypes.DATE,
      arrived_booking: DataTypes.DATE,
      booking_date: DataTypes.DATE,
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

  DispatchVehicle.associate = (models) => {
    DispatchVehicle.belongsTo(models.PurchaseOrderModel, {
      foreignKey: "po_id",
      as: "poentry"
    });
    DispatchVehicle.hasMany(models.DispatchBatch, {
      foreignKey: "dispatch_id",
      as: "batches",
      onDelete: "CASCADE"
    });
  };

  return DispatchVehicle;
};
