module.exports = (sequelize, DataTypes) => {
  const RawMaterialQcResult = sequelize.define(
    "RawMaterialQcResult",
    {
      rm_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      qc_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      test_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      result_value: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tested_by: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "raw_material_qc_results",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  RawMaterialQcResult.associate = (models) => {
    RawMaterialQcResult.belongsTo(models.RawMaterial, {
      foreignKey: "rm_id",
      as: "raw_materials"
    });

    RawMaterialQcResult.belongsTo(models.GrnEntry, {
      foreignKey: "qc_id",
      as: "qc_result"
    });

    RawMaterialQcResult.belongsTo(models.User, {
      foreignKey: "tested_by",
      as: "testedBy"
    });
  };

  return RawMaterialQcResult;
};
