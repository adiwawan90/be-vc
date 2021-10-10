module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
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
      tableName: "comments",
      timestamp: true,
    }
  );

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: "user_id",
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: "post_id",
    });
    Comments.hasMany(models.Comment_likes, {
      foreignKey: "comment_id",
    });
  };

  return Comments;
};
