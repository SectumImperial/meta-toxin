import './star-rating.scss'
import { EMPTY_STAR, FILL_STAR } from './constants.js'

class StarRating {
  constructor(element) {
    this.rating = element
    this.stars = element.querySelectorAll('.star-rating__star')

    try {
      this.rateNum = JSON.parse(this.rating.dataset.rating)
    } catch (err) {
      throw new Error('Ошибка в чтении options', err)
    }

    this.init()
  }
  init() {
    this.setRating()
  }

  setRating() {
    this.stars.forEach((star) => {
      if (star.dataset.rateсount <= this.rateNum) {
        star.classList.remove(EMPTY_STAR)
        star.classList.add(FILL_STAR)
      }
    })
  }
}

export default StarRating
