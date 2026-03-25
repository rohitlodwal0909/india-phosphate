module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define(
    "InvoiceItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      invoice_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,

      kind_of_pkgs: DataTypes.STRING,
      batch_no: DataTypes.STRING,
      mfg: DataTypes.DATE,
      exp: DataTypes.DATE,

      hsn: DataTypes.STRING,
      qty: DataTypes.FLOAT,
      rate: DataTypes.FLOAT,
      per: DataTypes.STRING,
      amount: DataTypes.FLOAT
    },
    {
      tableName: "invoice_items",
      timestamps: true,
      underscored: true
    }
  );

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: "invoice_id"
    });
  };

  return InvoiceItem;
};
