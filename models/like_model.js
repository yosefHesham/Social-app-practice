const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

const Like = mongoose.model("Likes", likeSchema);

module.exports = Like;
