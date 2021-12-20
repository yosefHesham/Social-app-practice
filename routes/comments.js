const Comment = require("../models/comment_model");

const auth = require("../middlewares/auth");
const CommentRouter = require("express").Router();

CommentRouter.post("/comments/:postId", auth, async (req, res) => {
  const userId = req.signedData.id;
  console.log(userId);

  const { commentData } = req.body;
  console.log(commentData);
  const comment = await Comment.create({
    comment: commentData,
    postId: req.params.postId,
    userId: userId,
  });

  res.send(comment);
});

CommentRouter.get("/comments/:postId", auth, async (req, res) => {
  console.log("a7a");
  const comments = await Comment.find()
    .where("postId")
    .equals(req.params.postId);
  res.send(comments);
});

module.exports = CommentRouter;
