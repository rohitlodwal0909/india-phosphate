module.exports = (sequelize, DataTypes) => {
  const EnquiryIntrestedProductsModel = sequelize.define(
    "EnquiryIntrestedProductsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      enquiry_id: {
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
      tableName: "enquiries_intrested_products",
      underscored: true
    }
  );

  EnquiryIntrestedProductsModel.associate = (models) => {
    EnquiryIntrestedProductsModel.belongsTo(models.EnquiryModel, {
      foreignKey: "enquiry_id",
      as: "enquiry"
    });

    EnquiryIntrestedProductsModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });

    EnquiryIntrestedProductsModel.belongsTo(models.User, {
      foreignKey: "person_name",
      as: "sales_name"
    });
  };

  return EnquiryIntrestedProductsModel;
};
