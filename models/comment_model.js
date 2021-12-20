const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  userId: String,
  postId: String,
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
