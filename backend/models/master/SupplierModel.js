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