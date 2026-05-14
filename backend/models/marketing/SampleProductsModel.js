module.exports = (sequelize, DataTypes) => {
  const SampleProductsModel = sequelize.define(
    "SampleProductsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      sample_id: {
        type: DataTypes.INTEGER
      },

      product_id: {
        type: DataTypes.INTEGER
      },

      grade: {
        type: DataTypes.STRING
      },

      qty: {
        type: DataTypes.STRING
      },
      sample_type: {
        type: DataTypes.STRING
      },

      file: {
        type: DataTypes.STRING
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "sample_products",
      underscored: true
    }
  );

  SampleProductsModel.associate = (models) => {
    SampleProductsModel.belongsTo(models.SampleRequestModel, {
      foreignKey: "sample_id",
      as: "audit"
    });

    SampleProductsModel.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });
  };

  return SampleProductsModel;
};
