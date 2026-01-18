module.exports = (socket, io) => {
  // Join a zone
  socket.on("join-ambulance-zone", ({ zoneId }) => {
    socket.join(`zone-${zoneId}`);
    console.log(`Ambulance joined zone-${zoneId}`);
  });

  // Ambulance goes online → join unique room
  socket.on("ambulance-online", ({ ambulanceId }) => {
    socket.join(`ambulance-${ambulanceId}`);
    console.log(`Ambulance ${ambulanceId} is now online`);
  });

  // Ambulance goes offline → leave unique room
  socket.on("ambulance-offline", ({ ambulanceId }) => {
    socket.leave(`ambulance-${ambulanceId}`);
    console.log(`Ambulance ${ambulanceId} is now offline`);
  });

  // Accept accident
  socket.on("accept-accident", ({ accidentId }) => {
    io.emit("accident-accepted", {
      accidentId,
      driverId: socket.user?._id || "unknown",
    });
  });
};
