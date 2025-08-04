module.exports = (sequelize, DataTypes) => {
  const DepartmentMaster = sequelize.define('DepartmentMaster', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    department_code: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hod: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
     tableName: 'department_master',
     timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at",
  });

  return DepartmentMaster;
};
