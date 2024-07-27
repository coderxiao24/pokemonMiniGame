const { Server } = require("socket.io");
const JWT = require("../utils/JWT");

function start(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    const payload = JWT.verify(socket.handshake.query.token);
    if (payload) {
      socket.user = payload;
      sendBroadList(io);
      socket.broadcast.emit("welcome", createMessage(null, socket.user));
    } else {
      socket.emit("error", createMessage(null, "token过期"));
    }

    socket.on("sendAll", (data) => {
      socket.broadcast.emit("sendAll", createMessage(socket.user, data));
    });
    socket.on("send", (msg) => {
      Array.from(io.sockets.sockets).forEach((item) => {
        if (item[1].user._id === msg.to) {
          item[1].emit("send", createMessage(socket.user, msg.data));
        }
      });
    });

    socket.on("Offline", (msg) => {
      console.log(111, msg);
      Array.from(io.sockets.sockets).forEach((item) => {
        console.log(item[1]);
        if (msg.users.includes(item[1].user._id)) {
          item[1].emit("Offline", msg.remark);
        }
      });
    });

    socket.on("disconnect", () => {
      sendBroadList(io);
    });
  });
}

function sendBroadList(io) {
  io.sockets.emit(
    "onlineUsers",
    createMessage(
      null,
      Array.from(io.sockets.sockets)
        .map((item) => item[1].user)
        .filter((item) => item)
    )
  );
}

function createMessage(user, data) {
  return {
    user: user,
    data: data,
  };
}

exports.start = start;
