const WebSocket = require('ws')

// Create a new WebSocket server instance
const wss = new WebSocket.Server({ port: 3000 })

// Broadcast to all clients
wss.broadcast = function broadcast (data) {
  console.log(this.clients.size)
  wss.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

wss.on('connection', function connection (ws) {
  console.log('A new client connected.')

  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
    const messageObj = JSON.parse(message)
    // Echo the message back to the client
    // wss.broadcast(JSON.stringify({ type: 'message', data: `Server received: ${message}`, username: 'Optional Username' }))
    const broadcastMessage = JSON.stringify({
      type: 'message', // Indicate this is a chat message
      data: messageObj.data,
      username: messageObj.username // Use the sender's username or a default
    })
    wss.broadcast(broadcastMessage)
    // ws.send(JSON.stringify({ type: 'message', data: `Server received: ${message}`, username: 'Optional Username' }))
    // ws.send(JSON.stringify({ message: `Server received: ${message}` }))
  })

  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }))
})

console.log('WebSocket server started on ws://localhost:3000')
