import {
  WIDTH,
  COUNT,
  ITEMS,
  ITEM,
  PREV,
  NEXT,
  TOGGLE,
  ACTIVE,
  LINK,
} from './constants';

class Carousel {
  constructor(element) {
    this.carousel = element;
    this.init();
  }

  init() {
    this.findElems();
    this.createVars();
    this.markToggless();
    this.checkActive();
    this.addListeners();
  }

  findElems() {
    this.list = this.carousel.querySelector(`.${ITEMS}`);
    this.listElems = this.carousel.querySelectorAll(`.${ITEM}`);
    this.prev = this.carousel.querySelector(`.${PREV}`);
    this.next = this.carousel.querySelector(`.${NEXT}`);
    this.toggles = this.carousel.querySelectorAll(`.${TOGGLE}`);
    this.link = this.carousel.querySelector(`.${LINK}`);
  }

  createVars() {
    this.width = WIDTH;
    this.count = COUNT;
    this.position = 0;
    this.xDown = null;
  }

  markToggless() {
    let i = 0;
    this.toggles.forEach((toggle) => {
      // eslint-disable-next-line no-param-reassign
      toggle.dataset.toggleCount = i;
      i += 1;
    });
  }

  addListeners() {
    this.prev.addEventListener('click', this.moveLeft.bind(this));
    this.next.addEventListener('click', this.moveRight.bind(this));

    this.toggles.forEach((element) => {
      element.addEventListener('click', this.moveToggle.bind(this));
    });
    this.carousel.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: true },
    );
    this.carousel.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      { passive: true },
    );

    this.link.addEventListener('keydown', this.handleKey.bind(this));
  }

  moveLeft() {
    this.position += this.width * this.count;
    this.position = Math.min(this.position, 0);
    this.list.style.marginLeft = `${this.position}px`;
    this.checkActive();
  }

  moveRight() {
    this.position -= this.width * this.count;
    this.position = Math.max(
      this.position,
      -this.width * (this.listElems.length - this.count),
    );
    this.list.style.marginLeft = `${this.position}px`;
    this.checkActive();
  }

  checkActive() {
    const countImage = this.position / -this.width;
    this.toggles.forEach((toggle) => {
      if (Number(toggle.dataset.toggleCount) === countImage) {
        toggle.classList.add(ACTIVE);
      } else {
        toggle.classList.remove(ACTIVE);
      }
    });
  }

  moveToggle({ target }) {
    const countImage = (this.position / this.width) * -1;
    const move = -(target.dataset.toggleCount - countImage) * this.width;
    this.position += move;
    this.list.style.marginLeft = `${this.position}px`;
    this.checkActive();
  }

  static getTouches(evt) {
    return evt.touches;
  }

  handleTouchStart(evt) {
    const firstTouch = Carousel.getTouches(evt)[0];
    this.xDown = firstTouch.clientX;
  }

  handleTouchMove(evt) {
    if (!this.xDown) {
      return;
    }
    const xUp = evt.touches[0].clientX;
    const xDiff = this.xDown - xUp;

    if (xDiff && xDiff > 0) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
    this.xDown = null;
  }

  handleKey({ code }) {
    if (code === 'ArrowRight') {
      this.moveRight();
    }

    if (code === 'ArrowLeft') {
      this.moveLeft();
    }
  }
}

export default Carousel;
