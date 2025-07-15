module.exports = (sequelize, DataTypes) => {
  const Qcbatch = sequelize.define(
    "Qcbatch",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      qc_batch_number : DataTypes.STRING,
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
      tableName: "qc_batch",
      underscored: true
    }
  );
Qcbatch.associate = (models) => {
  Qcbatch.hasMany(models.ProductionResult, {
    foreignKey: 'batch_id',      // Points to Qcbatch.id
    sourceKey: 'id',
    as: 'production_results',    // Optional alias
  });
};
  return Qcbatch;
};
