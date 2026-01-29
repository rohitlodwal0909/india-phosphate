module.exports = (sequelize, DataTypes) => {
  const BmrDispensingRawMaterial = sequelize.define(
    "BmrDispensingRawMaterial",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      bmr_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rm_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      checked_date: {
        type: DataTypes.DATEONLY
      },

      checked_by: {
        type: DataTypes.STRING
      },

      issued_by: {
        type: DataTypes.INTEGER
      },

      actual_qty: {
        type: DataTypes.TEXT
      },
      qc_reference: {
        type: DataTypes.TEXT
      }
    },
    {
      tableName: "bmr_dispensing_raw_materials",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrDispensingRawMaterial;
};
