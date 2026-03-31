module.exports = (sequelize, DataTypes) => {
  const DispatchBatch = sequelize.define(
    "DispatchBatch",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      dispatch_id: {
        type: DataTypes.INTEGER
      },
      batch_id: {
        type: DataTypes.INTEGER
      },
      quantity: DataTypes.STRING,
      unit: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "dispatch_batches",
      underscored: true
    }
  );

  DispatchBatch.associate = (models) => {
    DispatchBatch.belongsTo(models.DispatchVehicle, {
      foreignKey: "dispatch_id",
      as: "dispatch"
    });
    DispatchBatch.belongsTo(models.Qcbatch, {
      foreignKey: "batch_id",
      as: "batch"
    });
  };

  return DispatchBatch;
};
