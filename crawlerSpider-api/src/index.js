const express = require("express");

const webSocketReducer = require("./reducer/webSocketReducer");
require("./redis/redis");
const port = process.env.PORT || 3000;
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socket = io.on("connection", async (client) => {
  await webSocketReducer({
    type: "client_connected",
    client,
  });

  client.on("crawlerRequest", async (params) => {
    console.log("🚀 ~ file: index.js ~ line 24 ~ client.on ~ params", params);
    try {
      params.resultQueueUrl = client.userResultQueueUrl;
      await webSocketReducer({
        type: "request_crawling",
        requestParams: params,
      });
      await webSocketReducer({
        type: "pipe_crawling_results",
        client,
      });
    } catch (err) {
      console.log("🚀 ~ file: index.js ~ line 91 ~ client.on ~ err", err);
      client.emit("crawlerResultDone", false);
    }
  });

  client.on("disconnect", async (params) => {
    try {
      webSocketReducer({
        type: "client_disconnected",
        userResultQueueUrl: client.userResultQueueUrl,
      });
    } catch (err) {
      console.log("🚀 ~ file: index.js ~ line 78 ~ client.on ~ err", err);
    }
  });
});

server.listen(port, () => {
  console.log("server running on port:", port);
});
