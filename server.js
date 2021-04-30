const http = require("http");
const bodyParser = require("body-parser");
const db = require("./db");
const Controller = require("./Controller");
const express = require("express");
const app = express();
const port = 3002;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

db.sequelize.sync();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/reseve", Controller.getMag);

let interval;
var Grp = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("messageAll", (data) => {
    const newData = Object.assign(data, { send: false });
    console.log("message", newData);

    socket.broadcast.emit("message", newData);
  });

  socket.on("subscribe", (room) => {
    console.log("SUBS", room);
    Grp.indexOf(room) !== -1 ? console.log("yes") : Grp.push(room);
    socket.join(room);
  });

  socket.on("unsubscribe", (room) => {
    console.log("UNSUBS", room);
    socket.leave(room);
  });

  socket.on("roomMessage", (data) => {
    const newData = Object.assign(data.sendmessage, {
      send: false,
      roomname: data.room,
    });
    //console.log("data", newData);
    socket.broadcast.to(data.room).emit("message", newData);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", { response, Grp });
};

app.post("/send", Controller.createMsg);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
