// models/ExportDocument.js

module.exports = (sequelize, DataTypes) => {
  const ExportDocument = sequelize.define('ExportDocument', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    created_by:{
      type: DataTypes.INTEGER,
    },
    document_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    document_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    export_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    export_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Shipped'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    document_file: {
      type: DataTypes.STRING(255),
      allowNull: true
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
  }, {
    tableName: 'export_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,           // Enables soft delete (using deleted_at)
    deletedAt: 'deleted_at'
  });

  return ExportDocument;
};
// models/ExportDocument.js

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    document_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    document_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    export_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    export_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Shipped'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    document_file: {
      type: DataTypes.STRING(255),
      allowNull: true
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
  }, {
    tableName: 'export_documents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,           // Enables soft delete (using deleted_at)
    deletedAt: 'deleted_at'
  });

  return Document;
};
