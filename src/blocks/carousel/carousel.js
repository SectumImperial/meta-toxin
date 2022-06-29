import './carousel.scss'
import { WIDTH, COUNT } from './constants.js'

class Carousel {
  constructor(element) {
    this.carousel = element
    this.init()
  }

  init() {
    this.width = WIDTH
    this.count = COUNT
    this.position = 0

    this.list = this.carousel.querySelector('.carousel__items')
    this.listElems = this.carousel.querySelectorAll('.carousel__item')
    this.prev = this.carousel.querySelector('.carousel__prev')
    this.next = this.carousel.querySelector('.carousel__next')
    this.toggles = this.carousel.querySelectorAll('.carousel__toggle-button')

    this.markToggless()
    this.checkActive()
    this.addListners()
  }

  markToggless() {
    let i = 0
    for (let toggle of this.toggles) {
      toggle.dataset.toggleCount = i
      i++
    }
  }

  addListners() {
    this.prev.addEventListener('click', this.moveLeft.bind(this))
    this.next.addEventListener('click', this.moveRight.bind(this))

    this.toggles.forEach((element) => {
      element.addEventListener('click', this.moveToggle.bind(this))
    })
  }

  moveLeft() {
    this.position += this.width * this.count
    this.position = Math.min(this.position, 0)
    this.list.style.marginLeft = this.position + 'px'
    this.checkActive()
  }

  moveRight() {
    this.position -= this.width * this.count
    this.position = Math.max(
      this.position,
      -this.width * (this.listElems.length - this.count)
    )
    this.list.style.marginLeft = this.position + 'px'
    this.checkActive()
  }

  checkActive() {
    let countImage = this.position / -this.width
    this.toggles.forEach((toggle) => {
      if (Number(toggle.dataset.toggleCount) === countImage) {
        toggle.classList.add('_active')
      } else {
        toggle.classList.remove('_active')
      }
    })
  }

  moveToggle({ target }) {
    let countImage = (this.position / this.width) * -1
    let move = -(target.dataset.toggleCount - countImage) * this.width
    this.position += move
    this.list.style.marginLeft = this.position + 'px'
    this.checkActive()
  }
}

export default Carousel
