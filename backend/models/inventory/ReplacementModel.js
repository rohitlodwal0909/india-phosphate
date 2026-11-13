module.exports = (sequelize, DataTypes) => {
  const ReplacementModel = sequelize.define(
    "ReplacementModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      product_name: {
        type: DataTypes.STRING, // PO ID
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER, // PO ID
        allowNull: false
      },

      invoice_no: {
        type: DataTypes.INTEGER, // PO ID
        allowNull: true
      },
      work_order_id: { type: DataTypes.INTEGER, allowNull: true },
      work_order_no: { type: DataTypes.STRING, allowNull: true },
      po_source: { type: DataTypes.ENUM("marketing", "purchase"), allowNull: true },
      marketing_po_id: { type: DataTypes.INTEGER, allowNull: true },
      purchase_po_id: { type: DataTypes.INTEGER, allowNull: true },
      dispatch_id: { type: DataTypes.INTEGER, allowNull: true },
      note_type: { type: DataTypes.ENUM("debit", "credit"), allowNull: true },

      replacement_type: {
        type: DataTypes.ENUM("rejection", "short_qty"),
        allowNull: false
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true // only for short_qty
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },

      replacement_choice: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: false
      },

      credit_note: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: false
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "replacements",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  ReplacementModel.associate = (models) => {
    ReplacementModel.belongsTo(models.Invoice, {
      foreignKey: "invoice_no",
      as: "invoices"
    });
    ReplacementModel.belongsTo(models.WorkOrderModel, { foreignKey: "work_order_id", as: "workOrder" });
    ReplacementModel.belongsTo(models.PurchaseOrderModel, { foreignKey: "marketing_po_id", as: "marketingPO" });
    ReplacementModel.belongsTo(models.PurchasePoModel, { foreignKey: "purchase_po_id", as: "purchasePO" });
    ReplacementModel.belongsTo(models.DispatchVehicle, { foreignKey: "dispatch_id", as: "dispatch" });
  };

  return ReplacementModel;
};
