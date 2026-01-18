const { Server } = require("socket.io");
const socketAuth = require("../sockets/auth.socket.");
const ambulanceSocket = require("./ambulance.socket");


module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  global.io = io;

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    ambulanceSocket(socket, io);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
