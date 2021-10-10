module.exports = (sequelize, DataTypes) => {
  const Comment_likes = sequelize.define(
    "Comment_likes",
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
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_likes: {
        type: DataTypes.ENUM,
        values: ["like", "dislike"],
        allowNull: false,
        defaultValue: null,
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
      tableName: "comment_likes",
      timestamp: true,
    }
  );

  Comment_likes.associate = (models) => {
    Comment_likes.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
    Comment_likes.belongsTo(models.Posts, {
      foreignKey: "post_id",
    });
    Comment_likes.belongsTo(models.Comments, {
      foreignKey: "comment_id",
    });
  };

  return Comment_likes;
};
