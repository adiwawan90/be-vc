const express = require("express");
const router = express.Router();

const followerController = require("../controllers/followers");

router.post("/", followerController.follow);
router.get("/:id", followerController.getFollowers);

module.exports = router;
