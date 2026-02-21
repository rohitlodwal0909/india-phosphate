module.exports = (sequelize, DataTypes) => {
  const QcReportItem = sequelize.define(
    "QcReportItem",
    {
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      test: {
        type: DataTypes.STRING,
        allowNull: false
      },
      specification: {
        type: DataTypes.STRING
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "qc_report_items",
      underscored: true
    }
  );

  QcReportItem.associate = (models) => {
    QcReportItem.belongsTo(models.Qcbatch, {
      foreignKey: "report_id"
    });
  };

  return QcReportItem;
};
