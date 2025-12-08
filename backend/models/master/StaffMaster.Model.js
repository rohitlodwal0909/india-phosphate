module.exports = (sequelize, DataTypes) => {
  const StaffMaster = sequelize.define(
    "StaffMaster",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_by: {
        type: DataTypes.INTEGER
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      mobile_number: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      confirm_password: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      designation_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      qualification_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      kyc_details: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      profile_photo: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active"
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
      tableName: "staff_master",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true // if true, use deletedAt column automatically
    }
  );

  return StaffMaster;
};
