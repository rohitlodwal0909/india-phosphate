module.exports = (sequelize, DataTypes) => {
  const BmrRecordsModel = sequelize.define(
    "BmrRecordsModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      bmr_product_id: {
        type: DataTypes.INTEGER
      },
      batch_no: DataTypes.STRING,
      mfg_date: DataTypes.DATEONLY,
      exp_date: DataTypes.DATEONLY,
      mfg_start: DataTypes.STRING,
      mfg_complete: DataTypes.STRING,
      status: DataTypes.STRING,
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
      timestamps: true,
      paranoid: true,
      tableName: "bmr_records",
      underscored: true
    }
  );

  BmrRecordsModel.associate = (models) => {
    BmrRecordsModel.belongsTo(models.BmrMaster, {
      foreignKey: "bmr_product_id",
      as: "records"
    });
  };

  return BmrRecordsModel;
};
