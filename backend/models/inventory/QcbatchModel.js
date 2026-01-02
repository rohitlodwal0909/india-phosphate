module.exports = (sequelize, DataTypes) => {
  const Qcbatch = sequelize.define(
    "Qcbatch",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      qc_batch_number: DataTypes.STRING,
      product_name: DataTypes.STRING,
      mfg_date: DataTypes.STRING,
      exp_date: DataTypes.STRING,
      grade: DataTypes.STRING,
      size: DataTypes.STRING,
      status: DataTypes.INTEGER,
      reference_number: DataTypes.STRING,

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
      foreignKey: "batch_id", // Points to Qcbatch.id
      sourceKey: "id",
      as: "production_results" // Optional alias
    });

    Qcbatch.hasOne(models.BatchReleaseModel, {
      foreignKey: "batch_id", // Points to Qcbatch.id
      sourceKey: "id",
      as: "batch_releases" // Optional alias
    });

    Qcbatch.hasOne(models.Finishing, {
      foreignKey: "batch_number", // Points to Qcbatch.id
      sourceKey: "id",
      as: "finishing" // Optional alias
    });
  };

  return Qcbatch;
};
