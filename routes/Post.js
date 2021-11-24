const auth = require("../middlewares/auth");
const Post = require("../models/post_model");
const { User } = require("../models/user_model");

const PostRouter = require("express").Router();

PostRouter.get(
  "/posts",
  async (req, res) => {
    try {
      const posts = await Post.find().where("isPublic").equals(true);

      res.statusCode = 200;
      res.send({ message: "Success", posts: posts });
    } catch (e) {
      res.statusCode = 400;
      res.send(e.message);
    }
  },
  PostRouter.use(auth),

  PostRouter.post("/posts", async (req, res) => {
    try {
      const userId = req.signedData.id;
      let user = await User.findById(userId).select("displayName imageUrl");
      if (!user) {
        res.statusCode = 404;
        return res.send({ message: "User not found" });
      }
      user.id = userId;
      user = user;
      const { content, postImage } = req.body;
      if (!content) {
        res.statusCode = 401;
        return res.send({ message: "you must provide the post content" });
      }
      const post = await Post.create({
        content: content,
        postImage: postImage,
        postedBy: {
          displayName: user.displayName,
          imageUrl: user.imageUrl,
          id: user.id,
        },
      });

      res.statusCode = 200;
      res.send({ message: "Post Created Successfully", post: post });
    } catch (e) {
      res.send(e.message);
    }
  })
);

module.exports = PostRouter;
