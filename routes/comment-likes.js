const express = require("express");
const router = express.Router();

const commentLikesController = require("../controllers/comment-likes");

router.post("/", commentLikesController.postResponse);
// router.get("/:id", followerController.getFollowers);

module.exports = router;
