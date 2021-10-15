module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    "Posts",
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
      post: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
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
      tableName: "posts",
      timestamp: true,
    }
  );

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      as: "authors",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "user_id", allowNull: false },
    });
    Posts.hasMany(models.Comments, {
      foreignKey: "post_id",
      as: "comments",
    });
    Posts.hasMany(models.Post_likes, {
      foreignKey: "post_id",
      as: "likes",
    });
  };

  return Posts;
};
