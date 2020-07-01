const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    // POST TO EVENT BUS
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(posts[id]);
});

// HANDLE EVENTS
app.post("/events", (req, res, next) => {
  console.log("Received event", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v1000");
  console.log("Posts service listening on port 4000...");
});
