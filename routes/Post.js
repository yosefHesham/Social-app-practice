const upload = require("../helpers/image_upload");
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

  PostRouter.get("/posts/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        res.statusCode = 404;
        return res.send({ message: "Post not found" });
      } else if (!post.isPublic) {
        res.statusCode = 401;
        res.send({ message: "You are not allowed to see this post" });
      }
      res.statusCode = 200;
      res.send({ post: post });
    } catch (e) {
      res.send(e.message);
    }
  }),
  PostRouter.get("/posts/user/:id", auth, async (req, res) => {
    try {
      const post = await Post.find().where("postedBy.id").equals(req.params.id);
      if (!post) {
        res.statusCode = 404;
        return res.send({ message: "Post not found" });
      }
      res.statusCode = 200;
      res.send({ post: post });
    } catch (e) {
      res.send(e.message);
    }
  }),
  PostRouter.use(upload.single("post_image")),

  PostRouter.post("/posts", auth, async (req, res) => {
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

PostRouter.post("/posts/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      res.statusCode = 404;
      res.send({ mesage: "Post not found" });
    }
    const { content } = req.body;
    const imgUrl = req.file.path;
    post.content = content;
    post.postImage = imgUrl;
    post = await post.save();
    res.statusCode = 200;
    res.send({ post: post });
  } catch (e) {
    res.send(e.message);
  }
});

PostRouter.delete("/posts/:id", auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.statusCode = 200;
    res.send({ message: "Post deleted Successfully" });
  } catch (e) {
    res.send(e.message);
  }
});
module.exports = PostRouter;
