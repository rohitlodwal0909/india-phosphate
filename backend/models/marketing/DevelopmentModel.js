module.exports = (sequelize, DataTypes) => {
  const DevelopmentModel = sequelize.define(
    "DevelopmentModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      company_id: {
        type: DataTypes.INTEGER
      },

      date: {
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
      tableName: "developments",
      underscored: true
    }
  );

  DevelopmentModel.associate = (models) => {
    DevelopmentModel.hasMany(models.DevelopmentIntrestedProductsModel, {
      foreignKey: "development_id",
      as: "interested_products"
    });
    DevelopmentModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });
    DevelopmentModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return DevelopmentModel;
};
