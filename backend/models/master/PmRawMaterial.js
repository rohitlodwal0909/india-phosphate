module.exports = (sequelize, DataTypes) => {
  const PmRawMaterial = sequelize.define(
    "PmRawMaterial",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      pm_id: {
        type: DataTypes.INTEGER,
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
      }
    },
    {
      tableName: "pm_raw_materials",
      underscored: true,
      timestamps: false
    }
  );

  return PmRawMaterial;
};
