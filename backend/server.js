
const server = require('socket.io')(3001, {
  cors: {
    origin: '*',
  }
})

server.on('connection', (socket) => {

  socket.on('hello', message => {
    socket.emit('hello-back',message)
  })

  // disconnecting
  socket.on('disconnecting',() => {
    console.log('disconnected')
  })
})


