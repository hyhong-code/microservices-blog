const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res, next) => {
  const event = req.body;

  try {
    await axios.post("http://localhost:4000/events", event);
    await axios.post("http://localhost:4001/events", event);
    await axios.post("http://localhost:4002/events", event);
  } catch (error) {
    console.error(error);
  }

  res.send({ status: "OK" });
});

app.listen(4005, console.log("Event bus listening on port 4005"));
