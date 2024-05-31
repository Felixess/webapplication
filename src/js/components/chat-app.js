import { WindowContainer } from './window-container.js'
// import WebSocket from 'ws'

/** A template of the message page of chat-app */
const chatPage = document.createElement('template')
chatPage.innerHTML = `
  <link rel="stylesheet" href="css/chat-app.css">
  <div class="chat-page">
    <div class="messages-div">
      <template>
        <div class="ui blue segment message-username"></div>
        <div class="message-body"></div>
      </template>
    </div>
    <div class="ui fluid action input">
      <input id="messageField" type="text" placeholder="Type message here...">
      <div id="sendButton" class="ui button">Send</div>
    </div>
  </div>
`
let clientNumber = 1
// Simplified ChatApp class
export class ChatApp extends WindowContainer {
  constructor () {
    super()
    this._windowIcon.classList.add('comments', 'outline')
    this._windowTitle.textContent += ' Chat App'
    this.socket = null // Initialize the WebSocket connection variable
    this.username = 'User ' + clientNumber++
    this.initializeChat()
  }

  connect () {
    // Adjust the URL to your WebSocket server
    this.socket = new WebSocket('ws://localhost:3000')

    this.socket.onopen = (event) => {
      console.log('Connected to WebSocket server.')
    }

    this.socket.onmessage = (event) => {
      console.log(event.data) // Log the raw data received from the server

      try {
        const data = JSON.parse(event.data)
        this.getMessage(data)
        // Include logic here based on the parsed data, similar to what was in your script snippet
        if (data && data.event === 'issue_event') {
          // Handle your specific message cases as needed
        }
        if (data && data.event === 'refresh_page') {
          window.location.reload()
        }
        if (data && data.event === 'message') {
          this.getMessage(data)
        }
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }

    this.socket.onclose = (event) => {
      console.log('Disconnected from WebSocket server.')
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  sendMessage () {
    const message = this._messageInputField.value.trim()
    if (message) {
      // Construct the message object to display

      const messageObj = {
        type: 'message',
        data: message,
        username: this.username // Or use the actual username if available
      }

      // Display the message in the chat window
      // this.getMessage(messageObj)

      // Send the message to the server
      this.socket.send(JSON.stringify(messageObj))
      this._messageInputField.value = ''
    }
  }

  getMessage (message) {
    if (message.type !== 'heartbeat') {
      const tempMsg = document.importNode(this._messagesDiv.querySelector('template').content, true)
      tempMsg.querySelector('.message-username').textContent = message.username || `Global Chat, your name is ${this.username}`
      tempMsg.querySelector('.message-body').textContent = message.data
      this._messagesDiv.appendChild(tempMsg)
      this._messagesDiv.scrollTo(0, this._messagesDiv.scrollHeight)
    }
  }

  initializeChat () {
    this._container.appendChild(chatPage.content.cloneNode(true))
    this._messagesDiv = this.shadowRoot.querySelector('.messages-div')
    this._messageInputField = this.shadowRoot.querySelector('#messageField')
    this._sendButton = this.shadowRoot.querySelector('#sendButton')
    this._sendButton.addEventListener('click', () => this.sendMessage())
    this._messageInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage()
    })
    this.connect()
  }
}

window.customElements.define('chat-app', ChatApp)
