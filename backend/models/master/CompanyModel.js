module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define("Company", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_code: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(50),
    },
    state_id: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING(50),
      defaultValue: 'India',
    },
    pincode: {
      type: DataTypes.STRING(10),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    gst_number: {
      type: DataTypes.STRING(15),
    },
    cin_number: {
      type: DataTypes.STRING(21),
    },
    pan_number: {
      type: DataTypes.STRING(10),
    },
     tin_number: {
      type: DataTypes.STRING(20),
    },
    din_number: {
      type: DataTypes.STRING(21),
    },
    msme_reg: {
      type: DataTypes.STRING(20),
    },
     domestic: {
      type: DataTypes.STRING(20),
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "company",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  });

  return Company;
};
