module.exports = (sequelize, DataTypes) => {
  const DevelopmentIntrestedProductsModel = sequelize.define(
    "DevelopmentIntrestedProductsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      development_id: {
        type: DataTypes.INTEGER
      },

      product_id: {
        type: DataTypes.INTEGER
      },

      grade: {
        type: DataTypes.STRING
      },

      person_name: {
        type: DataTypes.STRING
      },

      followups: {
        type: DataTypes.TEXT
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "development_intrested_products",
      underscored: true
    }
  );

  DevelopmentIntrestedProductsModel.associate = (models) => {
    DevelopmentIntrestedProductsModel.belongsTo(models.DevelopmentModel, {
      foreignKey: "development_id",
      as: "development"
    });

    DevelopmentIntrestedProductsModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });

    DevelopmentIntrestedProductsModel.belongsTo(models.User, {
      foreignKey: "person_name",
      as: "sales_name"
    });
  };

  return DevelopmentIntrestedProductsModel;
};
