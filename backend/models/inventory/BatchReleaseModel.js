module.exports = (sequelize, DataTypes) => {
  const BatchReleaseModel = sequelize.define(
    "BatchReleaseModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      batch_id: {
        type: DataTypes.INTEGER
      },
      release_no: DataTypes.STRING,
      release_date: DataTypes.DATEONLY,
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
      tableName: "batch_releases",
      underscored: true
    }
  );
  BatchReleaseModel.associate = (models) => {
    BatchReleaseModel.belongsTo(models.Qcbatch, {
      foreignKey: "batch_id",
      sourceKey: "id",
      as: "batch"
    });
  };
  return BatchReleaseModel;
};
