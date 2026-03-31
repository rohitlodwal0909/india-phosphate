module.exports = (sequelize, DataTypes) => {
  const QuotationModel = sequelize.define(
    "QuotationModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      /* ================= USER ================= */
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      /* ================= COMPANY DETAILS ================= */
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      contact_person: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      trade_type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      country: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      inco_term: {
        type: DataTypes.STRING(50),
        allowNull: false
      },

      discharge_port: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      /* ================= EXTRA ================= */

      remark: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      /* ================= PRODUCTS ARRAY ================= */
      products: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      }
    },

    {
      tableName: "quotations",
      createdAt: "created_at",
      deletedAt: "deleted_at",
      updatedAt: "updated_at",
      timestamps: true, // disable default Sequelize timestamps
      paranoid: true // use deleted_at manually, not built-in paranoid mode
    }
  );

  return QuotationModel;
};
