const { Comments } = require("../models");
const { Posts } = require("../models");
const { Users } = require("../models");

const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  async createComment(req, res) {
    const { user_id, post_id, comment } = req.body;
    const schema = {
      user_id: "number|empty:false",
      post_id: "number|empty:false",
      comment: "string|empty:false|max:600",
    };

    try {
      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          status: "error",
          message: validate,
        });
      }

      const user = await Users.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }
      const post = await Posts.findByPk(post_id);
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "post not found",
        });
      }

      const createdComment = await Comments.create({
        user_id: user_id,
        post_id: post_id,
        comment: comment,
      });
      return res.status(200).json({
        status: "success",
        data: createdComment,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
