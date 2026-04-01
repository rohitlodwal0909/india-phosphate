module.exports = (sequelize, DataTypes) => {
  const FMIssuedModel = sequelize.define(
    "FMIssuedModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      finish_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      remark: {
        type: DataTypes.TEXT,
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
      tableName: "fm_issued",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    }
  );

  FMIssuedModel.associate = (models) => {
    FMIssuedModel.belongsTo(models.Finishing, {
      foreignKey: "finish_id" // The field in ProductionResult
    });
  };

  return FMIssuedModel;
};
