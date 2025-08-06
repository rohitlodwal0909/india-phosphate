

module.exports = (sequelize, DataTypes) => {
  const HSN = sequelize.define('HSN', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hsn_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    gst_rate: {
      type: DataTypes.DECIMAL(5, 2),
    },
    cgst_rate: {
      type: DataTypes.DECIMAL(5, 2),
    },
    sgst_rate: {
      type: DataTypes.DECIMAL(5, 2),
    },
    igst_rate: {
      type: DataTypes.DECIMAL(5, 2),
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'hsn_master',
     timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at", 
  });

  return HSN;
};
