module.exports = (sequelize, DataTypes) => {
  const ProductionPlanning = sequelize.define(
    "ProductionPlanning",
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

      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      material_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      quality: {
        type: DataTypes.STRING
      },

      batch_no: {
        type: DataTypes.STRING
      },

      work_order_no: {
        type: DataTypes.STRING
      },

      labours: {
        type: DataTypes.INTEGER
      },

      output_morning: {
        type: DataTypes.STRING
      },
      output_evening: {
        type: DataTypes.STRING
      },
      date: { type: DataTypes.STRING }
    },
    {
      tableName: "production_plannings",
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  ProductionPlanning.associate = (models) => {
    ProductionPlanning.belongsTo(models.Equipment, {
      foreignKey: "equipment_id"
    });

    ProductionPlanning.belongsTo(models.Product, {
      foreignKey: "material_id"
    });
  };

  return ProductionPlanning;
};
