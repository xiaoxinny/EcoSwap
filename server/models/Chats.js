module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define(
        "Chats",
        {
        socket_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        room_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        chat_data: {
            type: DataTypes.JSON,
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
        tableName: "Chats",
        timestamps: true,
        }
    );
    return Chats;
    }