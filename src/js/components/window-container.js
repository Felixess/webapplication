/** A template of the window container element */
const template = document.createElement('template')
template.innerHTML = `
   
    <link rel="stylesheet" href="css/window-container.css">
    
    <body>
        <div class="top">
            <i id="window-icon" class="bordered black icon"></i>
            <p id="window-title"></p>
            <i id="close-icon" class="bordered red close icon"></i>
            <i id="setting-icon" class="bordered black cogs icon"> </i>
            
        </div>

        <div class="content-div">
            
        </div>
    </body>
`
let z = 0

/** class creates an window-container custom HTMLElement */
export class WindowContainer extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._container = this.shadowRoot.querySelector('.content-div')

    this._header = this.shadowRoot.querySelector('.top')
    this._windowIcon = this.shadowRoot.querySelector('#window-icon')
    this._windowTitle = this.shadowRoot.querySelector('#window-title')
    this._closeicon = this.shadowRoot.querySelector('#close-icon')
    this._settingButton = this.shadowRoot.querySelector('#setting-icon')

    this.addEvents(this._header)
  }

  connectedCallback () {
  }

  /**
   * Add events to the window-container elements
   * @param element
   */
  addEvents (element) {
    let x = 0
    let y = 0
    let newX = 0
    let newY = 0

    /** add event to the window to increase zIndex value and focus the element */
    this.addEventListener('click', (e) => { this.style.zIndex = z++ })

    /** add click event to close icon to close the window  */
    this._closeicon.addEventListener('click', this.remove.bind(this))
    /** add event to change close icon color when the mouse is over it */
    this._closeicon.addEventListener('mouseover', function (e) {
      this.classList.add('inverted')
    })
    /** return close icon color when mouse leaves  */
    this._closeicon.addEventListener('mouseleave', function (e) {
      this.classList.remove('inverted')
    })

    /** add event to the window element when mousedown to start dragging */
    element.addEventListener('mousedown', dragOn)

    /**
     * take the mouse position and add events to the mouse movements
     * @param e
     */
    function dragOn (e) {
      /** increase zIndex value when click on the title bar to add focus effect before drag */
      this.offsetParent.style.zIndex = z++

      /** get mouse current position */
      x = e.clientX
      y = e.clientY

      /** stop dragging when mouse leave or mouse up */
      document.addEventListener('mouseup', stopMove)
      document.addEventListener('mouseleave', stopMove)

      /** start dragging while mouse moving */
      document.addEventListener('mousemove', onMove)
    }

    /**
     * move the captured element inside the browser page
     * @param e
     */
    function onMove (e) {
      /** calculare the mouse new position */
      newX = x - e.clientX
      newY = y - e.clientY
      x = e.clientX
      y = e.clientY

      /** calculate the new position where the element will placed */
      let top = element.offsetParent.offsetTop - newY + 'px'
      let left = element.offsetParent.offsetLeft - newX + 'px'

      /** conditions to keep the window inside the browser page */
      if (left < '0') {
        left = 0
      }
      if (top < '0') {
        top = 0
      }

      /** set the element final position */
      element.offsetParent.style.left = left
      element.offsetParent.style.top = top
    }

    /**
     * function removse the event from the element to stop the dragging
     * @param e
     */
    function stopMove (e) {
      document.removeEventListener('mousemove', onMove)
    }
  }

  static get observedAttributes () {
    return []
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }
}
/** define the window as a custom HTML element */
window.customElements.define('window-container', WindowContainer)
