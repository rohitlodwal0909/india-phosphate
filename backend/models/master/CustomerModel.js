module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      application: {
        type: DataTypes.STRING
      },
      company_hq: {
        type: DataTypes.STRING
      },
      company_address: {
        type: DataTypes.STRING,
        allowNull: false
      },

      customer_type: {
        type: DataTypes.ENUM("Trader", "End Customer", "Open Field")
      },

      trader_names: {
        type: DataTypes.JSON
      },

      open_field: {
        type: DataTypes.STRING
      },

      contacts: {
        type: DataTypes.JSON
      },

      addresses: {
        type: DataTypes.JSON
      },

      products: {
        type: DataTypes.JSON
      },

      convert_to_customer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      note: {
        type: DataTypes.TEXT
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      potential_opportunity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      source: {
        type: DataTypes.STRING
      },
      sales_person_id: {
        type: DataTypes.INTEGER
      },
      potential_note: {
        type: DataTypes.TEXT
      }
    },
    {
      tableName: "customers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true // if true, use deletedAt column automatically
    }
  );

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: "sales_person_id",
      sourceKey: "id",
      as: "sales_person"
    });
  };

  return Customer;
};
