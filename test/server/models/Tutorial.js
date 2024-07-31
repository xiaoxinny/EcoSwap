module.exports = (sequelize, DataTypes) => {
  const Tutorial = sequelize.define(
    "Tutorial",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageFile: {
        type: DataTypes.STRING(20),
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "tutorials",
    }
  );

  Tutorial.associate = (models) => {
    Tutorial.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Tutorial;
};
