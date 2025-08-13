// models/designation.model.js

module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define("Designation", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    designation_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Inactive",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
     
    },
  }, {
    tableName: 'designation',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  return Designation;
};
