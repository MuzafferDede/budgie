
const io = require('socket.io')(5001, {
  cors: {
    origin: '*',
  }
})

let users = [];

io.on('connection', (socket) => {
  socket.on('register', (client) => {
    let user = users.find(user => user.id === client.id);

    if (!user) {
      user = client
      users.push(user)
    }
    user.socketId = socket.id
    socket.user = user
  });

  socket.on('new message', (data, id) => {
    const contact = users.find(user => user.id === id);
    socket.to(contact.socketId).emit('new message', {
      user: socket.user,
      body: data,
      time: new Date()
    });
  });

  socket.on('add contact', (id) => {
    const contact = users.find(user => user.id === id);

    if (contact) {
      io.to(contact.socketId).emit('contact request', socket.user);
    }
  });

  socket.on('accept request', (id) => {
    const contact = users.find(user => user.id === id);

    if (contact) {
      io.to(contact.socketId).emit('request accepted', socket.user)
    }
  });

  socket.on('typing', (id) => {
    const contact = users.find(user => user.id === id);

    socket.to(contact.socketId).emit('typing', {
      user: socket.user
    });
  });

  socket.on('stop typing', (id) => {
    const contact = users.find(user => user.id === id);
    
    socket.to(contact.socketId).emit('stop typing', {
      user: socket.user
    });
  });

  socket.on('disconnect', (reason) => {
    socket.broadcast.emit('contact left', socket.user);
  });
});


