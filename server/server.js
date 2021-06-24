
const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('hello', message => {
    socket.emit('hello-back',message)
  })

  // disconnecting
  socket.on('disconnecting',() => {
    console.log('disconnected')
  })
})


