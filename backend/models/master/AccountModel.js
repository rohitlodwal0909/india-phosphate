module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
    account_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_type: {
      type: DataTypes.ENUM("Expense", "Income", "Asset", "Liability"),
      allowNull: false,
    },
    parent_account: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    opening_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    balance_type: {
      type: DataTypes.ENUM("Credit", "Debit"),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
     created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "account_name",
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
     paranoid: true, // enables soft delete using deletedAt
    deletedAt: 'deleted_at',
  });

 
  return Account;
};
