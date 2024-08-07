module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      message_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
      },
      room_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "Rooms",
          key: "room_name",
        },
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "Chat",
      timestamps: true,
    }
  );

  Chat.associate = (models) => {
    Chat.belongsTo(models.Rooms, {
      foreignKey: "room_name",
      targetKey: "room_name",
    });
  };

  return Chat;
};
