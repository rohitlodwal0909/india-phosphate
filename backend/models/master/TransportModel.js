// models/transport.model.js

module.exports = (sequelize, DataTypes) => {
  const Transport = sequelize.define("Transport", {
    transporter_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transporter_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alternate_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gst_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vehicle_types: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preferred_routes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    freight_rate_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_terms: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
     date:{
     type: DataTypes.DATE,
     },
     time:{
     type: DataTypes.TIME,
    },
     updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "transport",
   timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  });

  return Transport;
};
