const LikeRouter = require("express").Router();

const auth = require("../middlewares/auth");
const Like = require("../models/like_model");
const Post = require("../models/post_model");

module.exports = LikeRouter;

LikeRouter.post("/likes/post/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    const userId = req.signedData.id;

    if (!post) {
      res.statusCode = 404;
      res.send({ message: "Post not found" });
      return;
    }
    let like = await Like.findOne()
      .where("postId")
      .equals(req.params.id)
      .where("userId")
      .equals(userId);
    if (like) {
      await Like.findByIdAndDelete(like._id);
      post.likes--;
    } else {
      await Like.create({ postId: req.params.id, userId: userId });
      post.likes++;
    }
    post = await post.save();
    res.statusCode = 200;
    res.send({ post: post });
  } catch (e) {
    res.send(e.message);
  }
});
