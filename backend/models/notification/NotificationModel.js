
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN, // Use BOOLEAN instead of STRING for read status
      allowNull: true,
      defaultValue: false,
    },
     user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    received_by:{
     type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Notification;
};
