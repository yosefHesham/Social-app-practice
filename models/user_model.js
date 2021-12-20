const mongoose = require("mongoose");

const malePic =
  "https://secure.gravatar.com/avatar/141270ad849615ed6de6d0824d4895ec?s=400&d=mm&r=g";
const femalePic =
  "https://www.soniaworkmanlifecoaching.com/wp-content/uploads/bb-plugin/cache/anonymous-profile-square.jpg";
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      minLength: 5,
      maxLength: 255,
      required: true,
    },
    uniqueString: {
      type: String,
      // required: true,
      unique: true,
    },
    displayName: {
      type: String,
      minLength: 5,
      // required: true,
      // default: "",
      maxLength: 255,
    },
    password: {
      type: String,
      minLength: 5,
      required: true,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mailVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: "male",
      validate: {
        validator: function (v) {
          return v === "male" || v === "female";
        },
        message: "You should only choose male or female",
      },
    },
    imageUrl: {
      type: String,
      default: function () {
        if (this.gender == "male") {
          return malePic;
        }
        return femalePic;
      },
    },
    followers: [
      mongoose.Schema({
        _id: false,
        followerId: String,
        followerName: String,
      }),
    ],
    following: [
      mongoose.Schema({
        _id: false,
        followedId: String,
        followedName: String,
      }),
    ],
    bio: {
      type: String,
      min: 20,
      max: 255,
      default: "",
    },
    isAdmin: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports.User = User;
