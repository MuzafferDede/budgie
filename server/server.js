
const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})
const users = {};
const rooms = {};

io.on('connection', (socket) => {
  let userId;
  socket.on('send message', sender => {
    io.emit('received message', sender)
  })

  //login
  socket.on('login', user => {
    userId = user.id;
    users[userId] =  user;
    io.emit('new user', users)
  })

  socket.on('join room', (room, cb) => {
    socket.join(room, cb)
  })

  socket.on('typing', () => {
    io.emit('user typing', userId)
  })

  socket.on('not typing', () => {
    io.emit('user not typing', userId)
  })

  // disconnecting
  socket.on('disconnecting', () => {
    delete users[userId];
    io.emit('new user', users)
  })
})


