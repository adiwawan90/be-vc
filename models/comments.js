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
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "user_id", allowNull: false },
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: "post_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: { name: "post_id", allowNull: false },
    });
    Comments.hasMany(models.Comment_likes, {
      foreignKey: "comment_id",
    });
  };

  return Comments;
};
