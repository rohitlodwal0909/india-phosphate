module.exports = (sequelize, DataTypes) => {
  const BmrProductRelease = sequelize.define(
    "BmrProductRelease",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      bmr_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      department: {
        type: DataTypes.STRING
      },

      created_by: {
        type: DataTypes.INTEGER
      },

      product_release: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_product_release",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrProductRelease;
};
