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
  }

  #findElements() {
    this.subItems = this.nav.querySelectorAll(`.${SUBITEM}`);
  }

  #addListeners() {
    this.mediaQueryList.addEventListener('change', this.handleChangeScreen);
    this.subItems.forEach((element) => {
      element.addEventListener('click', this.handleNavSubItemClick);
    });
  }

  handleChangeScreen() {
    if (this.mediaQueryList.matches) {
      this.subItems.forEach((e) => {
        if (e.classList.contains('nav__subitem_active')) e.classList.remove('nav__subitem_active');
      });
    }
  }

  handleNavSubItemClick(e) {
    if (!this.mediaQueryList.matches) {
      e.preventDefault();
      const subItem = e.target.closest(`.${SUBITEM}`);
      subItem.classList.toggle('nav__subitem_active');
    }
  }
}

export default Nav;
