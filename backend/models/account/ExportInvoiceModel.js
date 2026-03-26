module.exports = (sequelize, DataTypes) => {
  const ExportInvoiceModel = sequelize.define(
    "ExportInvoiceModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      file: DataTypes.STRING
    },
    {
      tableName: "export_invoices",
      timestamps: true,
      underscored: true
    }
  );

  return ExportInvoiceModel;
};
