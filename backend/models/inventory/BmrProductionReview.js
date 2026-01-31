module.exports = (sequelize, DataTypes) => {
  const BmrProductionReview = sequelize.define(
    "BmrProductionReview",
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

      date: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "bmr_post_production_reviews",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return BmrProductionReview;
};
