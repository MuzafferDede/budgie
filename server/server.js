
const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})
const users = {};
const rooms = {};

io.on('connection', (socket) => {
  
  socket.on('send message', sender => {
    io.emit('received message', sender)
  })

  //login
  socket.on('login', user => {
    users[socket.id] = { id: socket.id, name: user };
    io.emit('new user', users)
  })

  socket.on('join room', (room,cb) => {
    socket.join(room, cb)
  })

  socket.on('typing', user => {
    io.emit('user typing', socket.id)
  })

  socket.on('not typing', user => {
    io.emit('user not typing', socket.id)
  })

  // disconnecting
  socket.on('disconnecting', () => {
    delete users[socket.id];
    io.emit('new user', users)
  })
})


