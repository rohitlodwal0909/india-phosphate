module.exports = (sequelize, DataTypes) => {
  const GstCache = sequelize.define(
    "GstCache",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      gstin: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
      },

      pan_number: {
        type: DataTypes.STRING(10),
        allowNull: true
      },

      legal_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      trade_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      constitution: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      taxpayer_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      gst_status: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      registration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      gst_last_updated: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      center_jurisdiction: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      center_jurisdiction_code: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      state_jurisdiction: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      state_jurisdiction_code: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      business_nature: {
        type: DataTypes.JSON,
        allowNull: true
      },

      address_building_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      address_building_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      address_floor_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      address_street: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      address_location: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      address_district: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      address_state: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      address_pincode: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      address_landmark: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      full_address: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      api_status_code: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      api_transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      api_timestamp: {
        type: DataTypes.BIGINT,
        allowNull: true
      },

      raw_response: {
        type: DataTypes.JSON,
        allowNull: true
      },

      last_fetched_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "gst_cache",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return GstCache;
};
