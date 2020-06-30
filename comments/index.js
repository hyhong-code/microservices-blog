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
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;

  // ADD STATUS PENDING
  commentsByPostId[req.params.id] = commentsByPostId[req.params.id]
    ? [...commentsByPostId[req.params.id], { id, content, status: "pending" }]
    : [{ id, content, status: "pending" }];

  try {
    // POST TO EVENT BUS
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (error) {
    console.log(error.response);
  }

  res.status(201).send(commentsByPostId[req.params.id]);
});

// EVENT LISTENER
app.post("/events", async (req, res, next) => {
  console.log("Received event", req.body.type);
  const { type, data } = req.body;

  // UPDATA COMMENT STATUS
  if (type === "CommentModerated") {
    const { id, postId, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    console.log(comment);
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: { ...comment, postId },
    });
  }

  res.send({});
});

app.listen(4001, console.log("Comments service running on port 4001"));
