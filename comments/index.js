const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(express.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res, next) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res, next) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  commentsByPostId[req.params.id] = commentsByPostId[req.params.id]
    ? [...commentsByPostId[req.params.id], { commentId, content }]
    : [{ commentId, content }];

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.listen(4001, console.log("Comments service running on port 4001"));
