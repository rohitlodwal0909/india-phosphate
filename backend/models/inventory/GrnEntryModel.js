module.exports = (sequelize, DataTypes) => {
  const GrnEntry = sequelize.define(
    "GrnEntry",
    {
      grn_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      grn_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      grn_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      supplier_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      manufacturer_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      invoice_number: DataTypes.STRING,
      batch_number: DataTypes.STRING,
      mfg_date: DataTypes.DATEONLY,
      exp_date: DataTypes.DATEONLY,
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      unit: {
        type: DataTypes.STRING,
        defaultValue: "Kg"
      },
      container_count: DataTypes.INTEGER,
      container_unit: DataTypes.STRING,
      store_location: DataTypes.STRING,
      store_rm_code: DataTypes.STRING,
      qa_qc_status: {
        type: DataTypes.ENUM("APPROVED", "REJECTED", "PENDING"),
        defaultValue: "PENDING"
      },
      remarks: DataTypes.TEXT,
      guard_entry_id: DataTypes.INTEGER
    },
    {
      tableName: "grn_entries",
      underscored: true
    }
  );

  GrnEntry.associate = (models) => {
    GrnEntry.belongsTo(models.GuardEntry, {
      foreignKey: "guard_entry_id",
      as: "guard_entry"
    });

    GrnEntry.hasMany(models.RawMaterialQcResult, {
      foreignKey: "qc_id",
      as: "qc_result"
    });
  };

  return GrnEntry;
};
