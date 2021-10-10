const express = require("express");
const router = express.Router();

const postLikesController = require("../controllers/post-likes");

router.post("/", postLikesController.postResponse);
// router.get("/:id", followerController.getFollowers);

module.exports = router;
