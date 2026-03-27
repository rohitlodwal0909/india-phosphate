module.exports = (sequelize, DataTypes) => {
  const ExportPackingListModel = sequelize.define(
    "ExportPackingListModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      file: DataTypes.STRING
    },
    {
      tableName: "export_packing_lists",
      timestamps: true,
      underscored: true
    }
  );

  return ExportPackingListModel;
};
