require("dotenv").config();
const express = require("express");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const followRouter = require("./routes/follower");
const postsRouter = require("./routes/posts");
const postsLikesRouter = require("./routes/post-likes");
const commentsRouter = require("./routes/comments");
const commentLikessRouter = require("./routes/comment-likes");

const app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/follows", followRouter);
app.use("/posts", postsRouter);
app.use("/posts-likes", postsLikesRouter);
app.use("/comments", commentsRouter);
app.use("/comments-likes", commentLikessRouter);

module.exports = app;
