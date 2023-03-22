import {
  ITEMS,
  OPENED_LIST,
  OPENED,
} from './constants';

class CheckboxList {
  constructor(selector) {
    this.checkboxList = selector;

    this.handleListClick = this.handleListClick.bind(this);
    this.handleListKeyPress = this.handleListKeyPress.bind(this);

    this.init();
  }

  init() {
    this.list = this.checkboxList.querySelector(`.${ITEMS}`);
    this.#addListeners();
    return this;
  }

  #addListeners() {
    this.checkboxList.addEventListener('click', this.handleListClick);
    this.checkboxList.addEventListener('keydown', this.handleListKeyPress);
    return this;
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

  #toggle() {
    if (this.checkboxList.classList.contains(OPENED)) {
      this.#removeClasses();
    } else {
      this.#addClasses();
    }
    return this;
  }

  #removeClasses() {
    this.checkboxList.classList.remove(OPENED);
    this.list.classList.remove(OPENED_LIST);
    return this;
  }

  #addClasses() {
    this.checkboxList.classList.add(OPENED);
    this.list.classList.add(OPENED_LIST);
    return this;
  }
}

export default CheckboxList;
