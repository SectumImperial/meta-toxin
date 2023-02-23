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

    this.handleCarouselMouseOver = this.handleCarouselMouseOver.bind(this);
    this.handleCarouselMouseOut = this.handleCarouselMouseOut.bind(this);
    this.handlePervButtonClick = this.handlePervButtonClick.bind(this);
    this.handleRightButtonClick = this.handleRightButtonClick.bind(this);
    this.handleCarouselToggleClick = this.handleCarouselToggleClick.bind(this);
    this.handleCarouselPrevTouchStart = this.handleCarouselPrevTouchStart.bind(this);
    this.handleCarouselPrevTouchStart = this.handleCarouselPrevTouchStart.bind(this);
    this.handleCarouselPrevTouchStart = this.handleCarouselPrevTouchStart.bind(this);
    this.handleCarouselPrevTouchStart = this.handleCarouselPrevTouchStart.bind(this);
    this.handleCarouselPrevTouchMove = this.handleCarouselPrevTouchMove.bind(this);
    this.handleLinkKeyDown = this.handleLinkKeyDown.bind(this);
    this.handleLinkKeyDown = this.handleLinkKeyDown.bind(this);

    this.init();
  }

  init() {
    this.#findElements();
    this.#createVars();
    this.#markToggles();
    this.#checkActive();
    this.#addListeners();
    return this;
  }

  #findElements() {
    this.list = this.carousel.querySelector(`.${ITEMS}`);
    this.listElements = this.carousel.querySelectorAll(`.${ITEM}`);
    this.prev = this.carousel.querySelector(`.${PREV}`);
    this.next = this.carousel.querySelector(`.${NEXT}`);
    this.toggles = this.carousel.querySelectorAll(`.${TOGGLE}`);
    this.link = this.carousel.querySelector(`.${LINK}`);
    return this;
  }

  #createVars() {
    this.width = WIDTH;
    this.count = COUNT;
    this.position = 0;
    this.xDown = null;
    return this;
  }

  #markToggles() {
    let i = 0;
    this.toggles.forEach((toggle) => {
      const toggleElem = toggle.closest(`.${TOGGLE}`);
      toggleElem.dataset.toggleCount = i;
      i += 1;
    });
    return this;
  }

  #addListeners() {
    this.carousel.addEventListener('mouseover', this.handleCarouselMouseOver);
    this.carousel.addEventListener('mouseout', this.handleCarouselMouseOut);

    this.prev.addEventListener('click', this.handlePervButtonClick);
    this.next.addEventListener('click', this.handleRightButtonClick);

    this.toggles.forEach((element) => {
      element.addEventListener('click', this.handleCarouselToggleClick);
    });
    this.carousel.addEventListener(
      'touchstart',
      this.handleCarouselPrevTouchStart,
      { passive: true },
    );
    this.carousel.addEventListener(
      'touchmove',
      this.handleCarouselPrevTouchMove,
      { passive: true },
    );

    this.link.addEventListener('keydown', this.handleLinkKeyDown);
    return this;
  }

  handleCarouselMouseOver() {
    this.#checkBtnVisibility();
    return this;
  }

  handlePervButtonClick() {
    this.#moveLeft();
    return this;
  }

  handleRightButtonClick() {
    this.#moveRight();
    return this;
  }

  handleCarouselMouseOut() {
    this.next.style.visibility = 'hidden';
    this.prev.style.visibility = 'hidden';
    return this;
  }

  handleCarouselToggleClick(e) {
    e.preventDefault();
    const { target } = e;
    const countImage = (this.position / this.width) * -1;
    const move = -(target.dataset.toggleCount - countImage) * this.width;
    this.position += move;
    this.list.style.marginLeft = `${this.position}px`;
    this.#checkActive();
    this.#checkBtnVisibility();
    return this;
  }

  handleCarouselPrevTouchStart(evt) {
    const firstTouch = Carousel.getTouches(evt).item(0);
    this.xDown = firstTouch.clientX;
    return this;
  }

  handleCarouselPrevTouchMove(evt) {
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

  handleLinkKeyDown({ code }) {
    if (code === 'ArrowRight') {
      this.#moveRight();
    }

    if (code === 'ArrowLeft') {
      this.#moveLeft();
    }
    return this;
  }

  #moveLeft() {
    this.position += this.width * this.count;
    this.position = Math.min(this.position, 0);
    this.list.style.marginLeft = `${this.position}px`;
    this.#checkActive();
    this.#checkBtnVisibility();
    return this;
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
    return this;
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
    return this;
  }

  static getTouches(evt) {
    return evt.touches;
  }
}

export default Carousel;
