const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res, next) => {
  res.send(posts);
});

// EVENT LISTENER
app.post("/events", (req, res, next) => {
  const { type, data } = req.body;

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

  console.log(posts);
  res.send({});
});

app.listen(4002, console.log(`Query service listening on port 4002`));
