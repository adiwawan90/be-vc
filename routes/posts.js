const express = require("express");
const router = express.Router();

const postController = require("../controllers/posts");

router.post("/", postController.createPost);
router.get("/:postId", postController.getPostById);
router.get("/", postController.getAllPosts);
router.put("/:userId/:postId", postController.editPost);
router.delete("/:userId/:postId", postController.deletePost);

router.get("/details/:postId", postController.postWithStatus);

module.exports = router;
