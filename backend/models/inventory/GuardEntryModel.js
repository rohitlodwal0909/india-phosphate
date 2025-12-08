module.exports = (sequelize, DataTypes) => {
  const GuardEntry = sequelize.define(
    "GuardEntry",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      entry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      entry_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      vehicle_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: false
      },
      inward_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity_net: {
        type: DataTypes.STRING,
        allowNull: false
      },
      guard_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      product_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      quantity_unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sender_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
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
      tableName: "guard_entries",
      underscored: true
    }
  );

  // Optional associations (if needed)
  GuardEntry.associate = (models) => {
    GuardEntry.hasMany(models.GrnEntry, {
      foreignKey: "guard_entry_id",
      as: "grn_entries"
    });
  };

  return GuardEntry;
};
