module.exports = (sequelize, DataTypes) => {
  const BmrMaster = sequelize.define(
    'BmrMaster',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bmr_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      batch_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      manufacturing_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      equipment_used: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      raw_materials: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      process_steps: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      packaging_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      qa_qc_signoff: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
       created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    },
    {
      timestamps: true, // adds createdAt and updatedAt
      paranoid: true,   // adds deletedAt for soft deletes
      tableName: 'bmr_master',
       createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    }
  );

  return BmrMaster;
};
