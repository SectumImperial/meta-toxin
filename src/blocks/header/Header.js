/* eslint-disable linebreak-style */

class Header {
  constructor(element) {
    this.header = element;
    this.init();
  }

  init() {
    this.#findElemes();
    this.mediaQueryList = window.matchMedia('(min-width: 960px)');
    this.#addListeners();
    this.#changeScreenClass();
  }

  #findElemes() {
    this.page = document.querySelector('body');
    this.subItems = this.header.querySelectorAll('.nav__subitem');
    this.iconMenu = this.header.querySelector('.header__icon');
    this.navWrapper = this.header.querySelector('.header__nav-wrapper');
  }

  #addListeners() {
    this.mediaQueryList.addEventListener('change', this.#handleChangeScreen.bind(this));
    this.iconMenu.addEventListener('click', this.#handleIconClick.bind(this));
    this.subItems.forEach((element) => {
      element.addEventListener('click', this.#handleNavSubItemClick.bind(this));
    });
  }

  #handleChangeScreen() {
    this.#changeScreenClass();
  }

  #changeScreenClass() {
    if (this.mediaQueryList.matches) {
      this.page.classList.remove('_touch');
      this.page.classList.add('_pc');
    } else {
      this.page.classList.remove('_pc');
      this.page.classList.add('_touch');
    }
  }

  #handleNavSubItemClick(e) {
    if (this.page.classList.contains('_pc')) return;
    if (e.target.closest('.nav__sublist')) return;
    e.preventDefault();
    const navItem = e.target.closest('.nav__item');
    navItem.classList.toggle('_active');
  }

  #handleIconClick() {
    this.iconMenu.classList.toggle('_active');
    this.navWrapper.classList.toggle('_active');
  }
}

export default Header;
