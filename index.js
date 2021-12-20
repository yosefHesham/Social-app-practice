const express = require("express");
const cors = require("cors");
const UserRouter = require("./routes/User");
const PostRouter = require("./routes/Post");
const LikeRouter = require("./routes/Like");
const CommentRouter = require("./routes/comments");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors());
require("dotenv").config();
require("./startup/db")();

app.use("/api", CommentRouter);
app.use("/api", PostRouter);
app.use("/api", UserRouter);
app.use("/api", LikeRouter);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("listening on ", port));
