module.exports = (sequelize, DataTypes) => {
  const MeetingModel = sequelize.define(
    "MeetingModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      meeting_title: {
        type: DataTypes.STRING
      },

      meeting_type: {
        type: DataTypes.STRING
      },
      meeting_link: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },

      platform: {
        type: DataTypes.TEXT
      },

      date: {
        type: DataTypes.DATEONLY
      },

      time: {
        type: DataTypes.STRING
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "meetings",
      underscored: true
    }
  );

  MeetingModel.associate = (models) => {
    MeetingModel.hasMany(models.MeetingInvitesModel, {
      foreignKey: "meeting_id",
      as: "invites_meetings"
    });

    MeetingModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return MeetingModel;
};
