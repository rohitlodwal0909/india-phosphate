module.exports = (sequelize, DataTypes) => {
  const PurchaseOrderModel = sequelize.define(
    "PurchaseOrderModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      po_no: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      company_id: {
        type: DataTypes.INTEGER
      },
      company_type: DataTypes.STRING,

      company_address: {
        type: DataTypes.TEXT
      },
      customer_name: {
        type: DataTypes.STRING
      },
      products: {
        type: DataTypes.TEXT
      },

      delivery_address: {
        type: DataTypes.TEXT
      },

      product_name: {
        type: DataTypes.STRING
      },

      grade: {
        type: DataTypes.STRING
      },

      ihs_document: {
        type: DataTypes.STRING
      },

      quantity: {
        type: DataTypes.DECIMAL(10, 2)
      },

      rate: {
        type: DataTypes.DECIMAL(10, 2)
      },

      gst: {
        type: DataTypes.DECIMAL(5, 2)
      },

      total: {
        type: DataTypes.DECIMAL(12, 2)
      },

      packing: {
        type: DataTypes.STRING
      },

      freight: {
        type: DataTypes.STRING
      },

      payment_terms: {
        type: DataTypes.TEXT
      },

      remark: DataTypes.TEXT,
      commission: DataTypes.STRING,
      insurance: DataTypes.STRING,
      insurance_remark: DataTypes.TEXT,

      domestic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      export: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      country_name: {
        type: DataTypes.STRING
      },

      inco_term: {
        type: DataTypes.STRING
      },

      discharge_port: {
        type: DataTypes.STRING
      },

      customise_labels: {
        type: DataTypes.TEXT
      },

      expected_delivery_date: {
        type: DataTypes.DATEONLY
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
      tableName: "purchase_orders",
      underscored: true
    }
  );

  PurchaseOrderModel.associate = (models) => {
    PurchaseOrderModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
    PurchaseOrderModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });
    PurchaseOrderModel.hasOne(models.WorkOrderModel, {
      foreignKey: "po_id",
      sourceKey: "id",
      as: "workNo"
    });
  };

  return PurchaseOrderModel;
};
