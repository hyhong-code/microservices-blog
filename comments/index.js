const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res, next) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res, next) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  commentsByPostId[req.params.id] = commentsByPostId[req.params.id]
    ? [...commentsByPostId[req.params.id], { commentId, content }]
    : [{ commentId, content }];

  // POST TO EVENT BUS
  await axios.post("http://localhost:4005/event", {
    type: "CommentCreated",
    data: { id: commentId, content, postId: req.params.id },
  });

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.listen(4001, console.log("Comments service running on port 4001"));
