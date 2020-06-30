const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  // LISTEN TO POST CREATED EVENT
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  // LISTEN TO COMMENT CREATED EVENT
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  // LISTEN TO COMMENT UPDATED
  if (type === "CommentUpdated") {
    const { id, postId, content, status } = data;
    const comment = posts[postId].comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res, next) => {
  res.send(posts);
});

// EVENT LISTENER
app.post("/events", (req, res, next) => {
  const { type, data } = req.body;
  console.log("Received event", type);
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log(`Query service listening on port 4002`);

  // SYNC EVENTS
  const res = await axios.get("http://localhost:4005/events");

  res.data.forEach((event) => {
    const { type, data } = event;
    console.log("Processing event:", type);
    handleEvent(type, data);
  });
});
