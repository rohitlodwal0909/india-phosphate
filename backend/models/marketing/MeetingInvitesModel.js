module.exports = (sequelize, DataTypes) => {
  const MeetingInvitesModel = sequelize.define(
    "MeetingInvitesModel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: DataTypes.INTEGER
      },

      meeting_id: {
        type: DataTypes.INTEGER
      },

      email: {
        type: DataTypes.STRING
      },

      status: {
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
      tableName: "meeting_invites",
      underscored: true
    }
  );

  MeetingInvitesModel.associate = (models) => {
    MeetingInvitesModel.belongsTo(models.MeetingModel, {
      foreignKey: "meeting_id",
      as: "meeting_invites"
    });

    MeetingInvitesModel.belongsTo(models.User, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "users"
    });
  };

  return MeetingInvitesModel;
};
