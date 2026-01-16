module.exports = (sequelize, DataTypes) => {
  const ProductionResult = sequelize.define(
    "ProductionResult",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      batch_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      rm_code: {
        type: DataTypes.JSON,
        allowNull: false
      },
      rm_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      rm_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      pm_code: {
        type: DataTypes.JSON,
        allowNull: false
      },
      pm_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      pm_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      equipments: {
        type: DataTypes.JSON,
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
      tableName: "production_result",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  ProductionResult.associate = (models) => {
    ProductionResult.hasMany(models.Finishing, {
      foreignKey: "batch_number",
      sourceKey: "batch_id",
      as: "finishing_entries"
    });
    ProductionResult.belongsTo(models.Qcbatch, {
      foreignKey: "batch_id", // The field in ProductionResult
      targetKey: "id", // The field in Qcbatch
      as: "qcbatch" // Optional alias
    });
  };
  return ProductionResult;
};
