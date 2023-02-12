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
    this.#findElements();
    this.#createVars();
    this.#markToggles();
    this.#checkActive();
    this.#addListeners();
  }

  #findElements() {
    this.list = this.carousel.querySelector(`.${ITEMS}`);
    this.listElements = this.carousel.querySelectorAll(`.${ITEM}`);
    this.prev = this.carousel.querySelector(`.${PREV}`);
    this.next = this.carousel.querySelector(`.${NEXT}`);
    this.toggles = this.carousel.querySelectorAll(`.${TOGGLE}`);
    this.link = this.carousel.querySelector(`.${LINK}`);
  }

  #createVars() {
    this.width = WIDTH;
    this.count = COUNT;
    this.position = 0;
    this.xDown = null;
  }

  #markToggles() {
    let i = 0;
    this.toggles.forEach((toggle) => {
      const toggleElem = toggle.closest(`.${TOGGLE}`);
      toggleElem.dataset.toggleCount = i;
      i += 1;
    });
  }

  #addListeners() {
    this.carousel.addEventListener('mouseover', this.#handleCarouselMouseOver.bind(this));
    this.carousel.addEventListener('mouseout', this.#handleCarouselMouseOut.bind(this));

    this.prev.addEventListener('click', this.#handlePervButtonClick.bind(this));
    this.next.addEventListener('click', this.#handleRightButtonClick.bind(this));

    this.toggles.forEach((element) => {
      element.addEventListener('click', this.#handleCarouselToggleClick.bind(this));
    });
    this.carousel.addEventListener(
      'touchstart',
      this.#handleCarouselPrevTouchStart.bind(this),
      { passive: true },
    );
    this.carousel.addEventListener(
      'touchmove',
      this.#handleCarouselPrevTouchMove.bind(this),
      { passive: true },
    );

    this.link.addEventListener('keydown', this.#handleLinkKeyDown.bind(this));
  }

  #handleCarouselMouseOver() {
    this.#checkBtnVisibility();
  }

  #handlePervButtonClick() {
    this.#moveLeft();
  }

  #handleRightButtonClick() {
    this.#moveRight();
  }

  #moveLeft() {
    this.position += this.width * this.count;
    this.position = Math.min(this.position, 0);
    this.list.style.marginLeft = `${this.position}px`;
    this.#checkActive();
    this.#checkBtnVisibility();
  }

  #moveRight() {
    this.position -= this.width * this.count;
    this.position = Math.max(
      this.position,
      -this.width * (this.listElements.length - this.count),
    );
    this.list.style.marginLeft = `${this.position}px`;
    this.#checkActive();
    this.#checkBtnVisibility();
  }

  #checkActive() {
    const countImage = this.position / -this.width;
    this.toggles.forEach((toggle) => {
      if (Number(toggle.dataset.toggleCount) === countImage) {
        toggle.classList.add(ACTIVE);
      } else {
        toggle.classList.remove(ACTIVE);
      }
    });
  }

  #checkBtnVisibility() {
    if (this.position === -this.width * (this.listElements.length - this.count)) {
      this.next.style.visibility = 'hidden';
    } else {
      this.next.style.visibility = 'visible';
    }

    if (this.position === 0) {
      this.prev.style.visibility = 'hidden';
    } else {
      this.prev.style.visibility = 'visible';
    }
  }

  #handleCarouselMouseOut() {
    this.next.style.visibility = 'hidden';
    this.prev.style.visibility = 'hidden';
  }

  #handleCarouselToggleClick(e) {
    e.preventDefault();
    const { target } = e;
    const countImage = (this.position / this.width) * -1;
    const move = -(target.dataset.toggleCount - countImage) * this.width;
    this.position += move;
    this.list.style.marginLeft = `${this.position}px`;
    this.#checkActive();
    this.#checkBtnVisibility();
  }

  #handleCarouselPrevTouchStart(evt) {
    const firstTouch = Carousel.getTouches(evt).item(0);
    this.xDown = firstTouch.clientX;
  }

  #handleCarouselPrevTouchMove(evt) {
    if (!this.xDown) {
      return;
    }
    const xUp = evt.touches.item(0).clientX;
    const xDiff = this.xDown - xUp;

    if (xDiff && xDiff > 0) {
      this.#moveRight();
    } else {
      this.#moveLeft();
    }
    this.xDown = null;
  }

  #handleLinkKeyDown({ code }) {
    if (code === 'ArrowRight') {
      this.#moveRight();
    }

    if (code === 'ArrowLeft') {
      this.#moveLeft();
    }
  }

  static getTouches(evt) {
    return evt.touches;
  }
}

export default Carousel;
