import {
  EMPTY_STAR,
  FILL_STAR,
} from './constants';

class StarRating {
  constructor(element) {
    this.rating = element;
    try {
      this.rateNum = JSON.parse(this.rating.dataset.rating);
    } catch (err) {
      throw new Error('Ошибка в чтении options', err);
    }

    this.init();
  }

  init() {
    this.stars = this.rating.querySelectorAll('.star-rating__star-icon');
    this.#setRating();
  }

  #setRating() {
    this.stars.forEach((star) => {
      if (star.dataset.rateсount <= this.rateNum) {
        star.classList.remove(EMPTY_STAR);
        star.classList.add(FILL_STAR);
      }
    });
  }
}

export default StarRating;
