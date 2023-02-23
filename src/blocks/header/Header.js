class Header {
  constructor(element) {
    this.header = element;
    this.handleIconClick = this.handleIconClick.bind(this);

    this.init();
  }

  init() {
    this.#findElements();
    this.#addListeners();
    return this;
  }

  handleIconClick() {
    this.iconMenu.classList.toggle('header__icon_active');
    this.navWrapper.classList.toggle('header__nav-wrapper_active');
    return this;
  }

  #addListeners() {
    this.iconMenu.addEventListener('click', this.handleIconClick);
    return this;
  }

  #findElements() {
    this.iconMenu = this.header.querySelector('.js-header__icon');
    this.navWrapper = this.header.querySelector('.js-header__nav-wrapper');
    return this;
  }
}

export default Header;
