import {
  SUBITEM,
  BREAKPOINT,
} from './constants';

class Nav {
  constructor(element) {
    this.nav = element;
    this.handleChangeScreen = this.handleChangeScreen.bind(this);
    this.handleNavSubItemClick = this.handleNavSubItemClick.bind(this);
    this.init();
  }

  init() {
    this.mediaQueryList = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    this.#findElements();
    this.#addListeners();
    return this;
  }

  #findElements() {
    this.subItems = this.nav.querySelectorAll(`.${SUBITEM}`);
    return this;
  }

  #addListeners() {
    this.mediaQueryList.addEventListener('change', this.handleChangeScreen);
    this.subItems.forEach((element) => {
      element.addEventListener('click', this.handleNavSubItemClick);
    });
    return this;
  }

  handleChangeScreen() {
    if (this.mediaQueryList.matches) {
      this.subItems.forEach((e) => {
        if (e.classList.contains('nav__subitem_active')) e.classList.remove('nav__subitem_active');
      });
    }
    return this;
  }

  handleNavSubItemClick(e) {
    if (!this.mediaQueryList.matches) {
      e.preventDefault();
      const subItem = e.target.closest(`.${SUBITEM}`);
      subItem.classList.toggle('nav__subitem_active');
    }
    return this;
  }
}

export default Nav;
