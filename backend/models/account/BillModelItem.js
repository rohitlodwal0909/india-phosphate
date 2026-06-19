module.exports = (sequelize, DataTypes) => {
  const BillModelItem = sequelize.define(
    "BillModelItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      bill_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      grade: DataTypes.STRING,
      kind_of_pkgs: DataTypes.STRING,
      batch_no: DataTypes.STRING,
      mfg: DataTypes.DATE,
      exp: DataTypes.DATE,

      hsn: DataTypes.STRING,
      qty: DataTypes.FLOAT,
      rate: DataTypes.FLOAT,
      per: DataTypes.STRING,
      amount: DataTypes.STRING
    },
    {
      tableName: "bill_items",
      timestamps: true,
      underscored: true
    }
  );

  BillModelItem.associate = (models) => {
    BillModelItem.belongsTo(models.BillModel, {
      foreignKey: "bill_id"
    });
    BillModelItem.belongsTo(models.Product, {
      foreignKey: "product_id"
    });
  };

  return BillModelItem;
};
