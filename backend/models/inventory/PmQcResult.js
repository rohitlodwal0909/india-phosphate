module.exports = (sequelize, DataTypes) => {
  const PmQcResult = sequelize.define(
    "PmQcResult",
    {
      pm_id: {
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
      tableName: "pm_qc_results",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  PmQcResult.associate = (models) => {
    PmQcResult.belongsTo(models.PmRawMaterial, {
      foreignKey: "pm_id",
      as: "pm_result"
    });

    PmQcResult.belongsTo(models.User, {
      foreignKey: "tested_by",
      as: "testedBy"
    });
  };

  return PmQcResult;
};
