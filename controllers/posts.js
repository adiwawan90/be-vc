const { Posts } = require("../models");
const { Users } = require("../models");

const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  async createPost(req, res) {
    const schema = {
      author_id: "number|empty:false",
      content: "string|empty:false",
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
      author_id: "number|empty:false",
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
  async getAllPosts(req, res) {
    try {
      const posts = await Posts.findAll();
      return res.status(200).json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  async getPostById(req, res) {
    const { postId } = req.params;

    try {
      const post = await Posts.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "post not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: post,
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
};
