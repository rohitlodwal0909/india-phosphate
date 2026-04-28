module.exports = (sequelize, DataTypes) => {
  const PurchaseStoreModel = sequelize.define(
    "PurchaseStoreModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      /* ================= USER ================= */
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      /* ================= PURCHASE ORDER ================= */
      po_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      /* ================= TRANSPORT DETAILS ================= */
      transporter_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      driver_name: {
        type: DataTypes.STRING(150),
        allowNull: true
      },

      driver_number: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      vehicle_number: {
        type: DataTypes.STRING(50),
        allowNull: false
      },

      /* ================= PRODUCT ================= */
      products: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      /* ================= LR DETAILS ================= */
      lr_no: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      expected_arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      /* ================= ENTRY DATE ================= */
      date: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "purchase_stores",

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",

      paranoid: true
    }
  );

  return PurchaseStoreModel;
};
