module.exports = (sequelize, DataTypes) => {
  const RawMaterial = sequelize.define(
    "RawMaterial",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      rm_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM("1", "2"), // e.g. 1 = Raw, 2 = Packing
        allowNull: false
      },
      test: {
        type: DataTypes.STRING,
        allowNull: true
      },
      limit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      result: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "raw_materials",
      underscored: true,
      timestamps: false
    }
  );

  RawMaterial.associate = (models) => {
    RawMaterial.hasMany(models.RawMaterialQcResult, {
      foreignKey: "rm_id",
      as: "qc_results"
    });
  };

  return RawMaterial;
};
