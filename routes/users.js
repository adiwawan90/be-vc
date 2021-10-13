const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");

/* GET users listing. */
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
