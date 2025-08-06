// models/batch_master.js

module.exports = (sequelize, DataTypes) => {
  const BatchMaster = sequelize.define('BatchMaster', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bmr_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    production_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    quantity_produced: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    raw_materials_used: {
      type: DataTypes.STRING, // or use a relation if needed
      allowNull: true,
    },
    process_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verified_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Final', 'Cancelled'),
      defaultValue: 'Draft',
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
  }, {
    tableName: 'batch_master',
       createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    timestamps: true, // disable default Sequelize timestamps
    paranoid: true,   // use deleted_at manually, not built-in paranoid mode
  });

  return BatchMaster;
};
