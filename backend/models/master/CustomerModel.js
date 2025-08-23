module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }, 
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'customer',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
     deletedAt: 'deleted_at',
    paranoid: true, // if true, use deletedAt column automatically
  });

  return Customer;
};