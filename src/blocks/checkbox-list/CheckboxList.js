import {
  ITEMS,
  OPENED_LIST,
  ACTIVE,
} from './constants';

class CheckboxList {
  constructor(selector) {
    this.checkboxList = selector;
    this.init();

    this.handleListClick = this.handleListClick.bind(this);
    this.handleListKeyPress = this.handleListKeyPress.bind(this);
  }

  init() {
    this.list = this.checkboxList.querySelector(`.${ITEMS}`);
    this.#addListeners();
  }

  #addListeners() {
    this.checkboxList.addEventListener('click', this.handleListClick);
    this.checkboxList.addEventListener('keydown', this.handleListKeyPress);
  }

  handleListClick({ target }) {
    if (target.closest(`.${ITEMS}`)) return;
    this.#toggle();
  }

  handleListKeyPress(e) {
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
}

export default CheckboxList;
