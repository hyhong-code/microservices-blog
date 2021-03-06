const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const events = []; // EVENT STORE

app.post("/events", (req, res, next) => {
  const event = req.body;

  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event); // POST
  axios.post("http://comments-srv:4001/events", event); // COMMENT
  axios.post("http://query-srv:4002/events", event); // QUERY
  axios.post("http://moderation-srv:4003/events", event); // MODERATION

  res.send({ status: "OK" });
});

app.get("/events", (req, res, next) => {
  res.send(events);
});

app.listen(4005, console.log("Event bus listening on port 4005"));
