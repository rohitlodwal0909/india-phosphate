module.exports = (sequelize, DataTypes) => {
  const EnquiryModel = sequelize.define(
    "EnquiryModel",
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

      sr_no: {
        type: DataTypes.STRING
      },

      note: {
        type: DataTypes.TEXT
      },

      follow_up_date: {
        type: DataTypes.DATEONLY
      },

      date: {
        type: DataTypes.DATEONLY
      },

      status: {
        type: DataTypes.STRING
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
      tableName: "enquiries",
      underscored: true
    }
  );

  EnquiryModel.associate = (models) => {
    EnquiryModel.hasMany(models.EnquiryIntrestedProductsModel, {
      foreignKey: "enquiry_id",
      as: "interested_products"
    });
    EnquiryModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });
    EnquiryModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return EnquiryModel;
};
