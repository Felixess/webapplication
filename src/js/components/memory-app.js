import { WindowContainer } from './window-container.js'
/** A template of the setting container */
const gameStartPage = document.createElement('template')
gameStartPage.innerHTML = `

  <link rel="stylesheet" href="css/memory-app.css">
  
  <h5 id = "startHeader"> 
      Select grid size and timer and click on start. 
  </h5> 

  <div class="gameStartContainer">  

    Grid Size: 
    <input type="radio" name="gridSize" value="4">2*2  
    <input type="radio" name="gridSize" value="16">4*4  
    <input type="radio" name="gridSize" value="30">6*5  
    <br> 
    Timer: 
    <input type="radio" name="timer" value="10">10 secs  
    <input type="radio" name="timer" value="30">30 secs  
    <input type="radio" name="timer" value="50">50 secs  
    <br> 
    <button id="startButton" class="ui primary button"> 
        Start 
    </button> 
  </div>
`
/** A template of the game container page */
const gameContainer = document.createElement('template')
gameContainer.innerHTML = `
  <link rel="stylesheet" href="css/memory-app.css">
  
  <div class="memoryGameContainer">  
    <template>
      <a href="#"><img src="image/0.png" alt="A memory brick"/></a>
    </template>
  </div>
`
/** class creates memory game app custom HTMLElement extending window-continer */
export class MemoryApp extends WindowContainer {
  constructor () {
    super()
    this._container.appendChild(gameStartPage.content.cloneNode(true))
    this._container.appendChild(gameContainer.content.cloneNode(true))

    /** add title to the window and remove setting icon */
    this._windowTitle.textContent += 'Memory Game'
    this._settingButton.classList.add('removed')

    this._pageHeader = this.shadowRoot.querySelector('#startHeader')
    this._startButton = this.shadowRoot.querySelector('#startButton')
    this._startContainer = this.shadowRoot.querySelector('.gameStartContainer')
    this._gameContainer = this.shadowRoot.querySelector('.memoryGameContainer')
  }

  connectedCallback () {
    /** got the values of radio buttons to create the game grid */
    this._startButton.addEventListener('click', (e) => {
      var radioValues = this.getRadioValues()
      if (radioValues) {
        if (radioValues[0] === '4') { this.fixGamePage(2, 2, radioValues[1]) } else if (radioValues[0] === '16') { this.fixGamePage(4, 4, radioValues[1]) } else if (radioValues[0] === '30') { this.fixGamePage(6, 5, radioValues[1]) }
      }
    })
  }

  /** get the radio buttons values and return it in an array */
  getRadioValues () {
    var checked = 0
    var result = []
    var ele = this.shadowRoot.querySelectorAll('input')
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type === 'radio') {
        if (ele[i].checked) {
          checked++
          result.push(ele[i].value)
        }
      }
    }
    /** return if two radio button is clicked */
    if (checked === 2) {
      return result
    }
  }

  /** function creates the game grid based on the values entered */
  fixGamePage (rows, cols, timer) {
    this._container.removeChild(this._startContainer)
    this.startGame(rows, cols, this._gameContainer, timer)
  }

  startGame (rows, cols, container, time) {
    var a
    var tiles = []
    var turn1
    var turn2
    var lastTile
    var pair = 0
    var tries = 0
    var header = this._pageHeader

    /** values for timer */
    var countdown = time
    var timerInterval = null

    /** update the header with timer info */
    header.textContent = 'You have ' + (countdown = time) + ' secs'
    timerInterval = setInterval(() => {
      header.textContent = 'You have ' + --countdown + ' secs'
      /** if timer is over */
      if (countdown <= 0) {
        clearInterval(timerInterval)
        header.textContent = 'Game Over'
        this._container.removeChild(this._gameContainer)
      }
    }, 1000)

    /** import template of the tile */
    var template = this.shadowRoot.querySelectorAll('template')[0].content.firstElementChild

    /** get an array of the pictures values shuffled */
    tiles = this.getPictureArray(rows, cols)

    /** iterate over the array and add click eventlistener for each tile */
    tiles.forEach(function (tile, index) {
      a = document.importNode(template, true)
      container.appendChild(a)

      a.addEventListener('click', (e) => {
        /** got the tile value after click and create img element of the brick */
        var img = e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
        turnBrick(tile, img)
      })

      if ((index + 1) % cols === 0) {
        container.appendChild(document.createElement('br'))
      }
    })

    /** function handle the game rules */
    function turnBrick (tile, img) {
      /** if playing quickly no tile will turned if two bricks already turned */
      if (turn2) { return }

      img.src = 'image/' + tile + '.png'

      if (!turn1) {
        // First tile clicked
        turn1 = img
        lastTile = tile
      } else {
        // Seconde tile clicked

        if (img === turn1) { // in case click the same tile
          return
        }
        tries += 1
        turn2 = img
        if (tile === lastTile) {
          // tiles are pair
          pair += 1
          if (pair === (cols * rows) / 2) {
            // won
            clearInterval(timerInterval)
            header.textContent = 'Win in ' + tries + ' number of tries. '
            header.textContent += 'You had ' + countdown + ' secs left'
          }

          /** hide won tiles after a while */
          window.setTimeout(function () {
            turn1.parentNode.classList.add('removed')
            turn2.parentNode.classList.add('removed')

            turn1 = null
            turn2 = null
          }, 300)
        } else {
          // tiles are not a pair
          window.setTimeout(function () {
            turn1.src = 'image/0.png'
            turn2.src = 'image/0.png'
            turn1 = null
            turn2 = null
          }, 500)
        }
      }
    }
  }

  getPictureArray (rows, cols) {
    var i
    var arr = []
    /** create array based on the size that user chose
     * divided by 2 because we need the same element twice
     */
    for (i = 1; i <= (rows * cols) / 2; i += 1) {
      arr.push(i)
      arr.push(i)
    }

    /** shuffle the array  */
    for (i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }

    return arr
  }

  static get observedAttributes () {
    return []
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }
}

/** define memory-app as a custom HTML element */
window.customElements.define('memory-app', MemoryApp)