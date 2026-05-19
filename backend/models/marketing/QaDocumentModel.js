module.exports = (sequelize, DataTypes) => {
  const QaDocumentModel = sequelize.define(
    "QaDocumentModel",
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
      tableName: "qadocuments",
      underscored: true
    }
  );

  QaDocumentModel.associate = (models) => {
    QaDocumentModel.hasMany(models.QaDocumentCoaModel, {
      foreignKey: "qa_document_id",
      as: "qa_document"
    });

    QaDocumentModel.belongsTo(models.Customer, {
      foreignKey: "company_id",
      sourceKey: "id",
      as: "customers"
    });

    QaDocumentModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return QaDocumentModel;
};
