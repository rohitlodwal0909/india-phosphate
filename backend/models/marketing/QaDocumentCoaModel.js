module.exports = (sequelize, DataTypes) => {
  const QaDocumentCoaModel = sequelize.define(
    "QaDocumentCoaModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      qa_document_id: {
        type: DataTypes.INTEGER
      },

      doc_name: {
        type: DataTypes.STRING
      },

      qa_person_id: {
        type: DataTypes.INTEGER
      },

      received_marketing_id: {
        type: DataTypes.INTEGER
      },

      share_customer_by: {
        type: DataTypes.INTEGER
      },

      status: {
        type: DataTypes.STRING
      },

      comment: {
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
      tableName: "qadocumentscoas",
      underscored: true
    }
  );

  QaDocumentCoaModel.associate = (models) => {
    QaDocumentCoaModel.belongsTo(models.QaDocumentModel, {
      foreignKey: "qa_document_id",
      as: "qa_documents"
    });

    QaDocumentCoaModel.belongsTo(models.User, {
      foreignKey: "qa_person_id",
      sourceKey: "id",
      as: "qa_persons"
    });

    QaDocumentCoaModel.belongsTo(models.User, {
      foreignKey: "received_marketing_id",
      sourceKey: "id",
      as: "received_marketing"
    });

    QaDocumentCoaModel.belongsTo(models.User, {
      foreignKey: "share_customer_by",
      sourceKey: "id",
      as: "share_customer"
    });
  };

  return QaDocumentCoaModel;
};
