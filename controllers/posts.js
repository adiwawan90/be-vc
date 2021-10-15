const Sequelize = require("sequelize");
const { Posts } = require("../models");
const { Users } = require("../models");
const { Post_likes } = require("../models");
const { Comments } = require("../models");
const { Comment_likes } = require("../models");

const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  async createPost(req, res) {
    const schema = {
      author_id: "number|empty:false",
      content: "string|empty:false|max:600",
      content_image: "string|optional",
    };

    try {
      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          status: "error",
          message: validate,
        });
      }

      const user = await Users.findByPk(req.body.author_id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const createPost = await Posts.create({
        user_id: req.body.author_id,
        post: req.body.content,
        image_url: req.body.content_image,
      });
      return res.status(200).json({
        status: "success",
        data: {
          id: createPost.id,
          author_id: createPost.user_id,
          content: createPost.post,
          content_image: createPost.image_url,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  async editPost(req, res) {
    const { userId, postId } = req.params;

    const schema = {
      // author_id: "number|empty:false",
      content: "string|empty:false",
      content_image: "string|optional",
    };

    try {
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "post not found",
        });
      }

      // check if not author
      if (Number(userId) !== post.user_id) {
        return res.status(404).json({
          status: "error",
          message: "edit not allowed",
        });
      }

      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(401).json({
          status: "error",
          message: validate,
        });
      }

      const editedPost = await post.update({
        user_id: Number(userId),
        post: req.body.content,
        image_url: req.body.content_image,
      });

      return res.status(200).json({
        status: "success",
        data: {
          id: editedPost.id,
          author_id: editedPost.user_id,
          content: editedPost.post,
          content_image: editedPost.image_url,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  async deletePost(req, res) {
    const { userId, postId } = req.params;

    try {
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "post not found",
        });
      }

      // check if not author
      if (Number(userId) !== post.user_id) {
        return res.status(404).json({
          status: "error",
          message: "can't delete this post",
        });
      }

      await post.destroy();

      return res.status(200).json({
        status: "success",
        message: "post successfully deleted",
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  // getPost by ID
  async postWithStatus(req, res) {
    const { postId } = req.params;

    try {
      const post = await Posts.findByPk(postId, {
        include: [
          {
            model: Comments,
            as: "comments",
            include: [
              {
                model: Users,
                as: "user",
                attributes: [
                  "id",
                  "email",
                  "username",
                  "firstname",
                  "lastname",
                  "photo_url",
                ],
              },
            ],
          },
          {
            model: Users,
            as: "authors",
            attributes: [
              "id",
              "email",
              "username",
              "firstname",
              "lastname",
              "photo_url",
            ],
          },
        ],
      });
      const likes = await Post_likes.count({
        col: "status_like",
        where: { post_id: postId, status_like: 1 },
      });
      const dislikes = await Post_likes.count({
        col: "status_like",
        where: { post_id: postId, status_like: 0 },
      });

      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "post not found",
        });
      }

      return res.status(200).json({
        status: "success ya",
        data: {
          id: post.id,
          user_id: post.user_id,
          author: post.authors,
          post: post.post,
          image_url: post.image_url,
          comments: post.comments,
          likes: likes,
          dislikes: dislikes,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  // get All posts
  async allPostWithStatus(req, res) {
    try {
      const posts = await Posts.findAll({
        include: [
          {
            model: Comments,
            as: "comments",
            include: [
              {
                model: Users,
                as: "user",
                attributes: [
                  "id",
                  "email",
                  "username",
                  "firstname",
                  "lastname",
                  "photo_url",
                ],
              },
              {
                model: Comment_likes,
                as: "likes",
              },
            ],
            // order: [[{ model: Comments, as: "comments" }, "id", "DESC"]],
          },
          {
            model: Users,
            as: "authors",
            attributes: [
              "id",
              "email",
              "username",
              "firstname",
              "lastname",
              "photo_url",
            ],
          },
          {
            model: Post_likes,
            as: "likes",
          },
        ],
        order: [
          ["id", "ASC"],
          [{ model: Comments, as: "comments" }, "id", "ASC"],
        ],
      });

      const mapResult = posts.map((item) => ({
        id: item.id,
        author_id: item.user_id,
        author: item.authors,
        post: item.post,
        image_url: item.image_url,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        comments: item.comments?.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          post_id: item.post_id,
          comment: item.comment,
          user: item.user,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          likes: item.likes
            ?.filter((tot) => tot.status_like === 1)
            ?.map((item) => item.status_like).length,
          dislikes: item.likes
            ?.filter((tot) => tot.status_like === 0)
            ?.map((item) => item.status_like).length,
        })),
        likes: item.likes
          ?.filter((tot) => tot.status_like === 1)
          ?.map((item) => item.status_like).length,
        dislikes: item.likes
          ?.filter((tot) => tot.status_like === 0)
          ?.map((item) => item.status_like).length,
      }));

      return res.status(200).json({
        status: "success",
        data: mapResult,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
