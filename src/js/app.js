import './components/chat-app.js'
import './components/memory-app.js'
/* import './components/news-app.js'
import './components/camera-app.js' */

/**
 * add an event-listener to chat icon to open chat-app
 */
document.querySelector('.button.chat').addEventListener('click', event => {
  const app = document.createElement('chat-app')
  document.querySelector('.mainscreen').appendChild(app)
})

/**
 * add an event-listener to memory game icon to open memory-app
 */
document.querySelector('.button.memory').addEventListener('click', event => {
  const app = document.createElement('memory-app')
  document.querySelector('.mainscreen').appendChild(app)
})

/**
 * add an event-listener to news icon to open news-app
 */
/* document.querySelector('.button.news').addEventListener('click', event => {
  const app = document.createElement('news-app')
  document.querySelector('.mainscreen').appendChild(app)
}) */

/**
 * add an event-listener to camera icon to open camera-app
 */
/* document.querySelector('.button.camera').addEventListener('click', event => {
  const app = document.createElement('camera-app')
  document.querySelector('.mainscreen').appendChild(app)
})  */
