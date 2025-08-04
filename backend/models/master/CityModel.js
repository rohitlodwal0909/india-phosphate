module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define("City", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city_name: {
      type: DataTypes.JSON,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: "cities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,         // enable deleted_at handling
    deletedAt: "deleted_at"
  });
  // Association
  City.associate = (models) => {
    City.belongsTo(models.State, {
      foreignKey: 'state_id',
      as: 'state',
    });
  };

  return City;
};
