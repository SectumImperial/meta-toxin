class Header {
  constructor(element) {
    this.header = element;
    this.init();
  }

  init() {
    this.#findElements();
    this.#addListeners();
  }

  #addListeners() {
    this.iconMenu.addEventListener('click', this.#handleIconClick.bind(this));
  }

  #findElements() {
    this.iconMenu = this.header.querySelector('.js-header__icon');
    this.navWrapper = this.header.querySelector('.js-header__nav-wrapper');
  }

  #handleIconClick() {
    this.iconMenu.classList.toggle('header__icon_active');
    this.navWrapper.classList.toggle('header__nav-wrapper_active');
  }
}

export default Header;
