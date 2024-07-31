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
      console.log(`广播消息日志-${socket.user.nickname}的广播:${data}`);
      socket.broadcast.emit("sendAll", createMessage(socket.user, data));
    });
    socket.on("send", (msg) => {
      Array.from(io.sockets.sockets).forEach((item) => {
        if (item[1].user._id === msg.to) {
          console.log(
            `私聊消息日志-${socket.user.nickname} => ${item[1].user.nickname}:${msg.data}`
          );
          item[1].emit("send", createMessage(socket.user, msg.data));
        }
      });
    });

    socket.on("action", (msg) => {
      Array.from(io.sockets.sockets).forEach((item) => {
        if (msg.users.includes(item[1].user._id)) {
          item[1].emit("action", msg);
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
