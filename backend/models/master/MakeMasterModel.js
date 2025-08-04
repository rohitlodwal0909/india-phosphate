module.exports = (sequelize, DataTypes) => {
  const MakeMaster = sequelize.define('MakeMaster', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    make_code: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    make_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    },
  }, {
     // Because we are manually handling timestamps
      tableName: 'make_master',
     timestamps: true, // enables createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // enables soft deletes using deleted_at
      deletedAt: "deleted_at",
  });

  return MakeMaster;
};
