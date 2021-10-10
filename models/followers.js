module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    "Followers",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      following_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "followers",
      timestamp: true,
    }
  );

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
  };

  return Followers;
};
