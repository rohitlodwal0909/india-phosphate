module.exports = (sequelize, DataTypes) => {
  const DraftPackingListModel = sequelize.define(
    "DraftPackingListModel",
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
      tableName: "draft_packing_lists",
      timestamps: true,
      underscored: true
    }
  );

  return DraftPackingListModel;
};
