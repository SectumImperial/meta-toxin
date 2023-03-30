import {
  LIKE_LIKEDHEART_TRUE,
  LIKE_LIKEDHEART_FALSE,
  LIKE_COUNTLIKED_TRUE,
  LIKE_BUTTONLIKED_TRUE,
  HEART,
  COUNT,
  BUTTON,
} from './constants';

class Like {
  constructor(element) {
    this.like = element;
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.init();
  }

  init() {
    this.#findElements();
    this.#addListeners();
    return this;
  }

  #findElements() {
    this.heart = this.like.querySelector(`.${HEART}`);
    this.count = this.like.querySelector(`.${COUNT}`);
    this.button = this.like.querySelector(`.${BUTTON}`);
    return this;
  }

  #addListeners() {
    this.like.addEventListener('click', this.handleLikeClick);
    return this;
  }

  handleLikeClick({ target }) {
    const btn = target.closest(`.${BUTTON}`);
    if (btn.classList.contains(LIKE_BUTTONLIKED_TRUE)) {
      this.#decrementLike();
    }

    if (!btn.classList.contains(LIKE_BUTTONLIKED_TRUE)) {
      this.#incrementLike();
    }
    this.#toggleClasses();
    return this;
  }

  #toggleClasses() {
    this.button.classList.toggle(LIKE_BUTTONLIKED_TRUE);
    this.heart.classList.toggle(LIKE_LIKEDHEART_TRUE);
    this.heart.classList.toggle(LIKE_LIKEDHEART_FALSE);
    this.count.classList.toggle(LIKE_COUNTLIKED_TRUE);
    return this;
  }

  #decrementLike() {
    const valueLike = Number(this.count.innerText);
    if (Number.isNaN(valueLike)) {
      this.count.innerText = 0;
      console.error('The like value MUST be number.');
    }
    const resultValue = Number(valueLike) - 1;
    this.count.innerText = resultValue;
    return this;
  }

  #incrementLike() {
    const valueLike = Number(this.count.innerText);
    if (Number.isNaN(valueLike)) {
      this.count.innerText = 0;
      console.error('The like value MUST be number.');
    }
    const resultValue = Number(valueLike) + 1;
    this.count.innerText = resultValue;
    return this;
  }
}

export default Like;
