
const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})

let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      user: socket.user,
      body: data,
      time: new Date()
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (user) => {
    if (addedUser) return;

    // we store the user in the socket session for this client
    socket.user = user;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      user: socket.user,
      numUsers: numUsers
    });

  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      user: socket.user
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      user: socket.user
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        user: socket.user,
        numUsers: numUsers
      });
    }
  });
});


