import {
  ITEMS,
  OPENED_LIST,
  ACTIVE,
} from './constants';

class CheckboxList {
  constructor(selector) {
    this.checkboxList = selector;
    this.init();
  }

  init() {
    this.list = this.checkboxList.querySelector(`.${ITEMS}`);
    this.#addListeners();
  }

  #addListeners() {
    this.checkboxList.addEventListener('click', this.#clickToggle.bind(this));
    this.checkboxList.addEventListener('keydown', this.#keyToggle.bind(this));
  }

  #removeClasses() {
    this.checkboxList.classList.remove(ACTIVE);
    this.list.classList.remove(OPENED_LIST);
  }

  #addClasses() {
    this.checkboxList.classList.add(ACTIVE);
    this.list.classList.add(OPENED_LIST);
  }

  #toggle() {
    if (this.checkboxList.classList.contains(ACTIVE)) {
      this.#removeClasses();
    } else {
      this.#addClasses();
    }
  }

  #clickToggle({ target }) {
    if (target.closest(`.${ITEMS}`)) return;
    this.#toggle();
  }

  #keyToggle(e) {
    const { code } = e;
    const { target } = e;

    if (target.closest(`.${ITEMS}`) && code === 'Space') {
      return;
    }

    if (code === 'Space') {
      e.preventDefault();
      this.#toggle();
    }
  }
}

export default CheckboxList;
