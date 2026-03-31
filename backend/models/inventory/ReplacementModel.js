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
        allowNull: false
      },

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
  };

  return ReplacementModel;
};
