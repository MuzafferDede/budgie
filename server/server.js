const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});

const path = require("path");

const PORT = process.env.PORT || 8080;

// REMOVE COMMENTS BELOW WHEN READY TO DEPLOY
// app.use(express.static(path.join(__dirname, "client/build")));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// const io = require('socket.io')(5001, {
//   cors: {
//     origin: '*',
//   }
// })

let connectedClients = [];

io.on('connection', (socket) => {
  socket.on('register', (registrar) => {
    let client = connectedClients.find(user => user.id === registrar.id);

    if (!client) {
      client = registrar

      connectedClients.push(client)
    }

    client.socketId = socket.id

    client.clientId = socket.client.id

    socket.user = client
  });

  socket.on('new message', (body, receiver) => {
    const client = connectedClients.find(user => user.id === receiver);

    if (client) {
      socket.to(client.socketId).emit('new message', {
        sender: socket.user.id,
        receiver: receiver,
        body: body,
        time: new Date()
      });
    }
  });

  socket.on('add contact', (id) => {
    const client = connectedClients.find(user => user.id === id);
    if (client) {
      io.to(client.socketId).emit('contact request', socket.user);
    }
  });

  socket.on('accept request', (id) => {
    const client = connectedClients.find(user => user.id === id);

    if (client) {
      io.to(client.socketId).emit('request accepted', socket.user)
    }
  });

  socket.on('typing', (id) => {
    const client = connectedClients.find(user => user.id === id);

    socket.to(client.socketId).emit('typing', {
      user: socket.user
    });
  });

  socket.on('stop typing', (id) => {
    const client = connectedClients.find(user => user.id === id);

    socket.to(client.socketId).emit('stop typing', {
      user: socket.user
    });
  });

  socket.on('disconnect', (reason) => {
    socket.broadcast.emit('contact left', socket.user);

    connectedClients = connectedClients.filter(client => client.clientId !== socket.client.id)
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));


