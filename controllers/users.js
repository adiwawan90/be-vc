const bcrypt = require("bcrypt");
const moment = require("moment");
const Validator = require("fastest-validator");
const v = new Validator();

const { Users } = require("../models");

module.exports = {
  async register(req, res) {
    const schema = {
      name: "string|empty:false",
      email: "email|empty:false",
      password: "string|min:6",
      dob: "string|optional",
      cover_url: "string|optional",
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

    if (req.body.dob) {
      const aDate = moment(req.body.dob, "YYYY-MM-DD", true);
      const isValid = aDate.isValid();
      if (!isValid) {
        return res.status(400).json({
          status: "error",
          message: "dob format YYYY-MM-DD",
        });
      }
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const data = {
      password,
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      cover_url: req.body.cover_url,
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
        name: user.name,
        email: user.email,
        dob: user.dob,
        role: user.role,
        cover_url: user.cover_url,
        photo_url: user.photo_url,
        status: user.status,
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
        email: user.email,
        name: user.name,
        dob: user.dob,
        photo_url: user.photo_url,
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
    const { id } = req.params;

    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false",
        password: "string|min:6",
        dob: "string|optional",
        cover_url: "string|optional",
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

      const password = await bcrypt.hash(req.body.password, 10);

      const { name, dob, photo_url, cover_url } = req.body;

      if (dob) {
        const aDate = moment(req.body.dob, "YYYY-MM-DD", true);
        const isValid = aDate.isValid();
        if (!isValid) {
          return res.status(400).json({
            status: "error",
            message: "dob format YYYY-MM-DD",
          });
        }
      }

      await user.update({
        email,
        password,
        name,
        dob,
        photo_url,
        cover_url,
      });

      return res.json({
        status: "success",
        data: {
          id: user.id,
          email,
          name,
          dob,
          photo_url,
          cover_url,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message || error,
      });
    }
  },
};
