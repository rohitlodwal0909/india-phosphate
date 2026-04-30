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

      // equipment_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },

      material_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },

      unit: {
        type: DataTypes.STRING
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

      expected_fpr_date: {
        type: DataTypes.DATEONLY
      },

      labours: {
        type: DataTypes.INTEGER
      },

      output: {
        type: DataTypes.STRING
      }
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
