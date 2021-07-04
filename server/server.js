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
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/public", "../index.html"));
// })
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

  socket.on('new message', (id, body) => {

    prepare(id, client => {
      socket.to(client.socketId).emit('new message', {
        sender: socket.user.id,
        receiver: id,
        body: body,
        time: new Date()
      });
    }, 'new message has issue')
  });

  socket.on('add contact', (id) => {
    prepare(id, (client) => {
      io.to(client.socketId).emit('contact request', socket.user);
    }, 'add contact has issue', () => {
      socket.emit('contact not found', { id });
    })
  });

  socket.on('accept request', (id) => {
    prepare(id, (client) => {
      io.to(client.socketId).emit('request accepted', socket.user)
    }, 'accept request has issue')
  });

  socket.on('typing', (id) => {
    prepare(id, (client) => {
      socket.to(client.socketId).emit('typing', {
        user: socket.user
      });
    }, 'typing has issue')
  });

  socket.on('stop typing', (id) => {
    prepare(id, (client) => {
      socket.to(client.socketId).emit('stop typing', {
        user: socket.user
      })
    }, 'stop typing has issue')
  });

  socket.on('disconnect', (reason) => {
    socket.broadcast.emit('leave', socket.user);
    connectedClients = connectedClients.filter(client => client.clientId !== socket.client.id)
  });

  const events = [
    "answer",
    "candidate",
    "hang",
    "offer",
  ]

  events.forEach((event) => {
    socket.on(event, payload => {
      prepare(payload.contact, client => {
        socket.to(client.socketId).emit(event, { ...payload, contact: socket.user })
      }, `${event} has issue`)
    })
  })

});

function prepare(id, callback, error, emit) {
  const client = connectedClients.find(user => user.id === id);

  if (client && client.socketId) {
    return callback(client)
  }

  console.warn(error)
  if (emit) {
    emit()
  }
}

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));


