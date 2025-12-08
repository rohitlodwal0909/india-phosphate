module.exports = (sequelize, DataTypes) => {
  const Finishing = sequelize.define(
    "Finishing",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },

      finish_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unfinish_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      batch_number: {
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
      tableName: "finishing",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  Finishing.associate = (models) => {
    Finishing.belongsTo(models.ProductionResult, {
      foreignKey: "batch_number",
      targetKey: "batch_id",
      as: "production_entry"
    });
  };
  return Finishing;
};
