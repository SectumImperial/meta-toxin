import {
  STAR_EMPTY_TRUE,
  STAR_EMPTY_FALSE,
} from './constants';

class StarRating {
  constructor(element) {
    this.rating = element;
    try {
      this.rateNum = JSON.parse(this.rating.dataset.rating);
    } catch (err) {
      console.error('Error in reading options', err);
    }

    this.init();
  }

  init() {
    this.stars = this.rating.querySelectorAll('.star-rating__star');
    this.#setRating();
    return this;
  }

  #setRating() {
    this.stars.forEach((star) => {
      if (star.dataset['rate-сount'] <= this.rateNum) {
        star.classList.remove(STAR_EMPTY_TRUE);
        star.classList.add(STAR_EMPTY_FALSE);
      }
    });
    return this;
  }
}

export default StarRating;
