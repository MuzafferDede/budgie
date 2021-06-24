
const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})
const users = {};

io.on('connection', (socket) => {
  socket.on('message', message => {
    console.log(message)
  })

  socket.on('send-message', sender => {
    io.emit('received-message', sender)
  })

  //login
  socket.on('login',user => {
    users[socket.id] = user;
  })

  // disconnecting
  socket.on('disconnecting',() => {
    delete users[socket.id];
  })
})


