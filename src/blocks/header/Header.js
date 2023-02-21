class Header {
  constructor(element) {
    this.header = element;
    this.handleIconClick = this.handleIconClick.bind(this);

    this.init();
  }

  init() {
    this.#findElements();
    this.#addListeners();
  }

  handleIconClick() {
    this.iconMenu.classList.toggle('header__icon_active');
    this.navWrapper.classList.toggle('header__nav-wrapper_active');
  }

  #addListeners() {
    this.iconMenu.addEventListener('click', this.handleIconClick);
  }

  #findElements() {
    this.iconMenu = this.header.querySelector('.js-header__icon');
    this.navWrapper = this.header.querySelector('.js-header__nav-wrapper');
  }
}

export default Header;
