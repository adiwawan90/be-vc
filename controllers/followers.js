const { Followers } = require("../models");
const { Users } = require("../models");

module.exports = {
  async follow(req, res) {
    const { user_id, following_id } = req.body;

    if (user_id === following_id) {
      return res.status(401).json({
        status: "error",
        message: "same id is not allowed",
      });
    }

    try {
      const user = await Users.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const userToFollow = await Users.findByPk(following_id);
      if (!userToFollow) {
        return res.status(404).json({
          status: "error",
          message: "user to follow not found",
        });
      }

      // check is user had follow?
      const isExist = await Followers.findOne({
        where: { user_id, following_id },
      });
      // check if user never follow, create new
      if (!isExist) {
        const created = await Followers.create({
          user_id,
          following_id,
          status: 1,
        });
        return res.status(201).json({
          status: "success",
          data: created,
        });
      }

      // check if user had follow, check again status 1 is following, and update to unfollow
      if (isExist.status == 1) {
        await isExist.update({ status: 0 });
        return res.status(200).json({
          status: "success",
          message: `you have unfollow ${userToFollow.username}`,
        });
      } else {
        // check if user had follow, check again status 0 is unfollow, so update to follow again
        await isExist.update({ status: 1 });
        return res.status(200).json({
          status: "success",
          message: `you have follow ${userToFollow.username}`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
  async getFollowers(req, res) {
    const { id } = req.params;

    try {
      const user = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Followers,
            as: "Followers",
          },
        ],
      });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const idsFollowing = user.Followers?.filter((item) => {
        return item.status == 1;
      }).map((item) => item.following_id);

      const mapFollowing = idsFollowing?.map(async (id) => {
        const user = await Users.findByPk(id, {
          attributes: { exclude: ["password"] },
        });
        return user;
      });

      const idsFollowers = await Followers.findAll({
        where: { following_id: id, status: 1 },
      });

      const userWithFollowers = {
        id: user.id,
        username: user.username,
        following: await Promise.all(mapFollowing),
        followers: idsFollowers,
      };

      return res.status(200).json({
        status: "success",
        data: await userWithFollowers,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
