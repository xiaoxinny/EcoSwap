module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define(
        "Rooms",
        {
            room_id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            socket_id: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            room_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
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
            tableName: "Rooms",
            timestamps: true,
        }
    );

    Rooms.associate = (models) => {
        Rooms.hasMany(models.Chat, {
            foreignKey: 'room_name', 
            sourceKey: 'room_name', 
        });
    };

    return Rooms;
};
