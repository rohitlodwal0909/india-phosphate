module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     manufacturer_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
     supplier_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     invoice_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    domestic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
    },
    contact_no: {
      type: DataTypes.STRING(20),
    },
    deleted_at: {
      type: DataTypes.DATE,
        allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'supplier',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // if true, use deletedAt column automatically
  });

  return Supplier;
};