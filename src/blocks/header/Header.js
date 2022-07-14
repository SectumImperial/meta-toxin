/* eslint-disable linebreak-style */
// const mediaQueryList = window.matchMedia('(min-width: 960px)');

class Header {
  constructor(element) {
    this.Header = element;
    this.init();
  }

  init() {
    this.findElemes();
    this.mediaQueryList = window.matchMedia('(min-width: 960px)');
    this.addListeners();
    this.toggleDevice();
  }

  findElemes() {
    this.page = document.querySelector('.page');
    this.subItems = document.querySelectorAll('.nav__subitem');
    this.iconMenu = document.querySelector('.header__icon');
    this.navWrapper = document.querySelector('.header__nav-wrapper');
  }

  addListeners() {
    this.mediaQueryList.addEventListener('change', this.toggleDevice.bind(this));
    this.iconMenu.addEventListener('click', this.toggleMenu.bind(this));
    this.subItems.forEach((element) => {
      element.addEventListener('click', this.toggleSub.bind(this));
    });
  }

  toggleDevice() {
    if (this.mediaQueryList.matches) {
      this.page.classList.remove('_touch');
      this.page.classList.add('_pc');
    } else {
      this.page.classList.remove('_pc');
      this.page.classList.add('_touch');
    }
  }

  toggleSub(e) {
    e.preventDefault();
    if (this.page.classList.contains('_pc')) return;
    const navItem = e.target.closest('.nav__item');
    navItem.classList.toggle('_active');
  }

  toggleMenu() {
    this.iconMenu.classList.toggle('_active');
    this.navWrapper.classList.toggle('_active');
  }
}

export default Header;
