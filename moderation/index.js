const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res, next) => {
  console.log("run");

  const { type, data } = req.body;
  console.log(type);
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    try {
      // EMIT A COMMENT CREATED EVENT FOR COMMENT SERVICE
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    } catch (error) {
      console.error(error.respnse);
    }
    console.log(status);
  }

  res.send({});
});

app.listen(4003, console.log(`Moderation service running on port ${4003}`));
