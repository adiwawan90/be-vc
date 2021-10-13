const bcrypt = require("bcrypt");
const moment = require("moment");
const Validator = require("fastest-validator");
const v = new Validator();

const { Users } = require("../models");

module.exports = {
  async register(req, res) {
    const schema = {
      username: "string|empty:false",
      email: "email|empty:false",
      password: "string|min:6",
      firstname: "string|optional",
      lastname: "string|optional",
      photo_url: "string|optional",
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      return res.status(409).json({
        status: "error",
        message: "email already exist",
      });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const data = {
      password,
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      photo_url: req.body.photo_url,
      role: "user",
      status: "active",
    };

    const createdUser = await Users.create(data);

    // setelah succes, kembalikan response ke FE
    return res.json({
      status: "success",
      data: {
        id: createdUser.id,
      },
    });
  },

  async login(req, res) {
    const schema = {
      email: "email|empty:false",
      password: "string|min:6",
    };

    const validate = v.validate(req.body, schema);

    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    res.json({
      status: "success",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        photo_url: user.photo_url,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  },

  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await Users.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        cover_url: user.cover_url,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },

  async updateUser(req, res) {
    try {
      const schema = {
        username: "string|optional",
        email: "email|optional",
        password: "string|min:6|optional",
        firstname: "string|optional",
        lastname: "string|optional",
        photo_url: "string|optional",
      };

      const validate = v.validate(req.body, schema);

      if (validate.length) {
        return res.status(400).json({
          status: "error",
          message: validate,
        });
      }

      const id = req.params.id;
      const user = await Users.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      const email = req.body.email;
      if (email) {
        const checkEmail = await Users.findOne({
          where: { email },
        });

        if (checkEmail && email !== user.email) {
          return res.status(409).json({
            status: "error",
            message: "email already exist",
          });
        }
      }

      const { username, firstname, lastname, photo_url } = req.body;

      if (photo_url) {
        const updatedUser = await user.update({
          photo_url,
        });

        return res.json({
          status: "success",
          data: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            photo_url: updatedUser.photo_url,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
          },
        });
      }

      const password = await bcrypt.hash(req.body.password, 10);
      await user.update({
        username,
        email,
        password,
        firstname,
        lastname,
        photo_url,
      });

      return res.json({
        status: "success",
        data: {
          id: user.id,
          username,
          email,
          firstname,
          lastname,
          photo_url,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await Users.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }

      await user.destroy();

      return res.status(200).json({
        status: "success",
        message: "user deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
