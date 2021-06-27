
const io = require('socket.io')(5001, {
  cors: {
    origin: '*',
  }
})

let users = {};

io.on('connection', (socket) => {
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data, id) => {
    const found = Object.keys(users).find(user => users[user].id === id);
    // we tell the client to execute 'new message'
    socket.to(found).emit('new message', {
      user: socket.user,
      body: data,
      time: new Date()
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (user) => {

    // we store the user in the socket session for this client
    socket.user = user;
    users[socket.id] = user;

    socket.emit('login', {
      users: users
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      user: socket.user,
      users: users
    });

  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      user: socket.user
    });
  });

    // add contact
    socket.on('add contact', (id) => {
      const found = Object.keys(users).find(user => users[user].id === id);
      if(found) {
        io.to(found).emit('contact request', socket.user);
      }
    });

    // accept request
    socket.on('accept request', (contact) => {
      const found = Object.keys(users).find(user => users[user].id === contact.id);
      if(found) {
        io.to(found).emit('request accepted', socket.user)
      }
    });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      user: socket.user
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        user: socket.user,
        users: users
      });

      delete users[socket.id]
  });
});


