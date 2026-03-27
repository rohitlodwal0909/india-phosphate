module.exports = (sequelize, DataTypes) => {
  const SampleInvoice = sequelize.define(
    "SampleInvoice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      file: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "sample_invoices",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return SampleInvoice;
};
