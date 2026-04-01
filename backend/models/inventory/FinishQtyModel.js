module.exports = (sequelize, DataTypes) => {
  const FinishQty = sequelize.define(
    "FinishQty",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      finish_id: {
        type: DataTypes.INTEGER
      },

      finishing_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unfinishing_qty: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      time: {
        type: DataTypes.STRING,
        allowNull: false
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "finish_quantities",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  FinishQty.associate = (models) => {
    FinishQty.belongsTo(models.Finishing, {
      foreignKey: "finish_id"
    });
  };
  return FinishQty;
};
