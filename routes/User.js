const mongoose = require("mongoose");
const UserRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../helpers/image_upload");
let User = require("../models/user_model");
const send_email = require("../helpers/send_email");

module.exports = UserRouter;

const auth = require("../middlewares/auth");
const { urlencoded } = require("express");

UserRouter.post("/user/register/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.User.findOne({ email }).exec();
    if (user) {
      res.statusCode = 401;
      return res.send("this mail is already in use");
    }
    const hash = await bcrypt.hash(password, 7);
    const uniqueString = mongoose.Types.ObjectId().toHexString();

    user = await User.User.create({
      userName: username,
      password: hash,
      email: email,
      uniqueString: uniqueString,
      displayName: username,
    });
    res.statusCode = 200;
    send_email(email, uniqueString);
    res.send({
      response: "Success !",
      message: "Account created, please verify your email !",
      data: { username: username, email: email, userId: user._id },
    });
  } catch (err) {
    res.statusCode = 412;
    res.send(err.message);
  }
});

UserRouter.get("/user/verify/:uniqueString", async (req, res) => {
  try {
    const { uniqueString } = req.params;
    const user = await User.User.findOne({ uniqueString }).exec();
    if (user) {
      res.statusCode = 200;
      res.send("Mail Verified, you can now log in !");
    }
    user.mailVerified = true;
    await user.save();
  } catch (err) {
    res.statusCode = 401;
    res.send(err.message);
  }
});

// log in route

UserRouter.post("/user/login/", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.User.findOne({ email }).exec();
    if (!user) {
      res.statusCode = 404;
      return res.send({
        reponse: "Error while loggin in",
        message: "Invalid email or password ! ",
      });
    }
    const hash = await bcrypt.compare(password, user?.password);
    if (!hash) {
      res.statusCode = 404;
      return res.send({
        reponse: "Error while loggin in",
        message: "Invalid email or password ! ",
      });
    }

    // if (!user.mailVerified) {
    //   res.statusCode = 401;
    //   return res.send("Please Verify Your email");
    // }
    console.log(process.env.jwtPrivateKey);
    const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
    res.statusCode = 200;
    res.send({ message: "Signed in successfully", token: token });
  } catch (err) {
    res.send(err.message);
  }
});

UserRouter.use(auth);

UserRouter.get("/user/users/", async (req, res) => {
  try {
    const users = await User.User.find().select(
      "displayName gender bio, imageUrl email"
    );
    res.statusCode = 200;
    res.send({ message: "Succees !", users: users });
  } catch (err) {
    res.send(err.message);
  }
});

UserRouter.get("/user/me", async (req, res) => {
  try {
    const id = req.signedData.id;

    const user = await User.User.findById(
      id,
      "-isAdmin -password -uniqueString -mailVerified"
    );
    if (!user) {
      res.statusCode = 404;
      res.send({ message: "Failed !" }, "user not found");
    }
    res.statusCode = 200;
    res.send({ message: "Succees !", user: user });
  } catch (err) {
    res.send(err.message);
  }
});

UserRouter.post("/user/editProfile", async (req, res) => {
  try {
    const id = req.signedData.id;
    let user = await User.User.findById(
      id,
      "-isAdmin -password -uniqueString -mailVerified"
    );
    if (!user) {
      res.statusCode = 404;
      res.send({ message: "error", details: "User with given id not found" });
    }
    const { displayName, bio, gender } = req.body;
    user.displayName = displayName;
    user.bio = bio;
    user.gender = gender.toLowerCase();
    user = await user.save();
    res.statusCode = 200;
    res.send({ message: "Success !", updatedInfo: user });
  } catch (err) {
    res.send(err.message);
  }
});
UserRouter.post(
  "/user/change-profilePic",
  upload.single("profile_pic"),
  async (req, res, next) => {
    const id = req.signedData.id;
    let user = await User.User.findById(id);
    user.imageUrl = req.file.path;
    user = await user.save();
    return res.send(user);
  }
);

UserRouter.post("/user/follow/:id", async (req, res) => {
  try {
    const id = req.signedData.id;
    const followedId = mongoose.Types.ObjectId(req.params.id);
    let user = await User.User.findById(id);

    let followedUser = await User.User.findById(followedId);

    const follower = { followerId: id, followerName: user.displayName };
    const following = {
      followedId: followedUser._id,
      followedName: followedUser.displayName,
    };
    console.log(follower);
    if (
      followedUser.followers.includes(
        followedUser.followers.find((el) => el.followerId === id)
      )
    ) {
      followedUser.followers.pop(follower);
      user.following.pop(following);
      user = await user.save();
      await followedUser.save();
    } else {
      followedUser.followers.push(follower);
      await followedUser.save();
      user.following.push(following);
      user = await user.save();
    }
    return res.send({ message: "Succes", user: user });
  } catch (e) {
    res.send(e.message);
  }
});
