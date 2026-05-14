module.exports = (sequelize, DataTypes) => {
  const SampleRequestModel = sequelize.define(
    "SampleRequestModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      sr_no: {
        type: DataTypes.STRING
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      company_id: {
        type: DataTypes.INTEGER
      },

      type: {
        type: DataTypes.STRING
      },

      contact_person: {
        type: DataTypes.STRING
      },

      mobile: {
        type: DataTypes.INTEGER
      },

      address: {
        type: DataTypes.TEXT
      },

      remark: {
        type: DataTypes.TEXT
      },

      qc_status: {
        type: DataTypes.STRING
      },

      qc_coa_pdf: {
        type: DataTypes.STRING
      },

      qc_remark: {
        type: DataTypes.TEXT
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
      tableName: "samplerequests",
      underscored: true
    }
  );

  SampleRequestModel.associate = (models) => {
    SampleRequestModel.hasMany(models.SampleProductsModel, {
      foreignKey: "sample_id",
      as: "interested_products"
    });
    SampleRequestModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });
    SampleRequestModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return SampleRequestModel;
};
