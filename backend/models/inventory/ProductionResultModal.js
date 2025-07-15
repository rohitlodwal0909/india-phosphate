module.exports = (sequelize, DataTypes) => {
  const ProductionResult = sequelize.define(
    'ProductionResult',
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
      rm_code: {
        type: DataTypes.JSON,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
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
      tableName: 'production_result',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
   ProductionResult.associate = (models) => {
    ProductionResult.hasMany(models.Finishing, {
    foreignKey: 'batch_number',
    sourceKey: 'batch_id',  
    as: 'finishing_entries',
  });
   ProductionResult.belongsTo(models.Qcbatch, {
    foreignKey: 'batch_id',        // The field in ProductionResult
    targetKey: 'id',               // The field in Qcbatch
    as: 'qcbatch',                 // Optional alias
  });
};
  return ProductionResult;
};