import {
  LIKED__HEART,
  UNLIKED__HEART,
  LIKED_COUNT,
  LIKED_BUTTON,
} from './constants';

class Like {
  constructor(element) {
    this.like = element;
    this.init();
  }

  init() {
    this.#findElements();
    this.#addListeners();
  }

  #findElements() {
    this.heart = this.like.querySelector('.like__heart-icon');
    this.count = this.like.querySelector('.like__count');
    this.button = this.like.querySelector('.like__button');
  }

  #addListeners() {
    this.like.addEventListener('click', this.#handleLikeClick.bind(this));
  }

  #handleLikeClick({ target }) {
    const btn = target.closest('.like__button');
    if (btn.classList.contains(LIKED_BUTTON)) {
      this.#decrementLike();
    }

    if (!btn.classList.contains(LIKED_BUTTON)) {
      this.#incrementLike();
    }
    this.#toggleClasses();
  }

  #toggleClasses() {
    this.button.classList.toggle(LIKED_BUTTON);
    this.heart.classList.toggle(LIKED__HEART);
    this.heart.classList.toggle(UNLIKED__HEART);
    this.count.classList.toggle(LIKED_COUNT);
  }

  #decrementLike() {
    let val = Number(this.count.innerText);
    if (Number.isNaN(val)) {
      this.count.innerText = 0;
      throw new Error('The like value MUST be number.');
    }
    val -= 1;
    this.count.innerText = val;
  }

  #incrementLike() {
    let val = Number(this.count.innerText);
    if (Number.isNaN(val)) {
      this.count.innerText = 0;
      throw new Error('The like value MUST be number.');
    }
    val += 1;
    this.count.innerText = val;
  }
}

export default Like;
