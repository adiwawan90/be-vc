module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "inactive"],
        allowNull: false,
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "user"],
        allowNull: false,
        defaultValue: "user",
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
      tableName: "users",
      timestamp: true,
    }
  );

  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Users.hasMany(models.Followers, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Users.hasMany(models.Posts, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Users.hasMany(models.Comments, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
      as: "user",
    });
    Users.hasMany(models.Post_likes, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Users.hasMany(models.Comment_likes, {
      foreignKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };

  return Users;
};
