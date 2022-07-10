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
    this.heart = this.like.querySelector('.like__heart');
    this.count = this.like.querySelector('.like__count');
    this.button = this.like.querySelector('.like__button');

    this.addListeners();
  }

  addListeners() {
    this.like.addEventListener('click', this.toggleLike.bind(this));
  }

  toggleLike() {
    if (this.button.classList.contains(LIKED_BUTTON)) {
      this.decrementLike();
    }

    if (!this.button.classList.contains(LIKED_BUTTON)) {
      this.incrementLike();
    }
    this.toggleClasses();
  }

  toggleClasses() {
    this.button.classList.toggle(LIKED_BUTTON);
    this.heart.classList.toggle(LIKED__HEART);
    this.heart.classList.toggle(UNLIKED__HEART);
    this.count.classList.toggle(LIKED_COUNT);
  }

  decrementLike() {
    let val = Number(this.count.innerText);
    if (Number.isNaN(val)) {
      this.count.innerText = 0;
      throw new Error('The like value MUST be number.');
    }
    val += 1;
    this.count.innerText = val;
  }

  incrementLike() {
    let val = Number(this.count.innerText);
    if (Number.isNaN(val)) {
      this.count.innerText = 0;
      throw new Error('The like value MUST be number.');
    }
    val -= 1;
    this.count.innerText = val;
  }
}

export default Like;
