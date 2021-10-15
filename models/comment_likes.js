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
      tableName: "comment_likes",
      timestamp: true,
    }
  );

  Comment_likes.associate = (models) => {
    Comment_likes.belongsTo(models.Users, {
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "user_id", allowNull: false },
    });
    Comment_likes.belongsTo(models.Posts, {
      as: "posts",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "post_id", allowNull: false },
    });
    Comment_likes.belongsTo(models.Comments, {
      as: "likes",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "comment_id", allowNull: false },
    });
  };

  return Comment_likes;
};
