// models/category.model.js

module.exports = (sequelize, DataTypes) => {
  const State  = sequelize.define("State", {
     id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
   created_by: {
    type: DataTypes.INTEGER,
  },
  state_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
    tableName: 'states',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // enables soft delete using deletedAt
    deletedAt: 'deleted_at',
  });

   State.associate = (models) => {
    State.hasMany(models.City, {
      foreignKey: "state_id",
     as: "cities"
    });
  };
  return State;
};
