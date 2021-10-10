module.exports = (sequelize, DataTypes) => {
  const Post_likes = sequelize.define(
    "Post_likes",
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
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_like: {
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
      tableName: "post_likes",
      timestamp: true,
    }
  );

  Post_likes.associate = (models) => {
    Post_likes.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
    Post_likes.belongsTo(models.Posts, {
      foreignKey: "post_id",
    });
  };

  return Post_likes;
};
