const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 10,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    postImage: {
      type: String,
    },

    postedBy: mongoose.Schema({
      _id: false,
      displayName: String,
      id: String,
      imageUrl: {
        type: String,
      },
    }),
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
