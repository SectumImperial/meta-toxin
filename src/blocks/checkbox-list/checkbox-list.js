import {
  ITEMS,
  OPENED,
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
    this.addListeners();
  }

  addListeners() {
    this.checkboxList.addEventListener('click', this.toggle.bind(this));
  }

  toggle({ target }) {
    if (target.closest(`.${OPENED}`)) return;
    if (this.checkboxList.classList.contains(ACTIVE)) {
      this.checkboxList.classList.remove(ACTIVE);
      this.list.classList.remove(OPENED_LIST);
    } else {
      this.checkboxList.classList.add(ACTIVE);
      this.list.classList.add(OPENED_LIST);
    }
  }
}

export default CheckboxList;
