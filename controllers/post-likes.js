const { Users } = require("../models");
const { Posts } = require("../models");
const { Post_likes } = require("../models");

const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  async postResponse(req, res) {
    const { user_id, post_id, status_like } = req.body;
    const schema = {
      user_id: "number|empty:false",
      post_id: "number|empty:false",
      status_like: ["boolean", "number|min:0|max:1"],
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

      const isExist = await Post_likes.findOne({
        where: {
          user_id,
          post_id,
        },
      });
      // check if user never likes the post, create new
      if (!isExist) {
        const createdLikes = await Post_likes.create({
          user_id,
          post_id,
          status_like,
        });
        return res.status(201).json({
          status: "success",
          data: createdLikes,
        });
      }
      // if user have likes / dislike the post, just update status_likes
      const updateLikes = await isExist.update({
        user_id,
        post_id,
        status_like,
      });
      return res.status(201).json({
        status: "success",
        data: updateLikes,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
