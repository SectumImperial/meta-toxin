import ValidationError from './helpers/error';
import chooseWord from '../../helpers/chooseWord';
import isEqual from './helpers/isEqual';
import cutString from './helpers/cutString';

import {
  DEFAULT_KEY,
  FIELD,
  INPUT,
  CONTENT,
  BTN_CLEAR,
  BTN_ACCEPT,
  COUNT,
  COUTER,
  BTNS_DEC,
  BTNS_INC,
  TYPE,
  ITEM,
  DISABLED,
} from './constants';

class Dropdown {
  constructor(element) {
    this.dropdown = element;

    try {
      this.options = JSON.parse(this.dropdown.dataset.options);
    } catch (err) {
      throw new ValidationError('Ошибка в чтении options', err);
    }

    this.init();
  }

  init() {
    this.findElems();
    this.checkBtnVisibility(this.dropdown, `.${COUNT}`);
    this.type = this.dropdown.querySelector(`.${TYPE}`).value;

    this.addListeners();
    this.checkUrlDates();
  }

  findElems() {
    this.field = this.dropdown.querySelector(`.${FIELD}`);
    this.dropdownInput = this.dropdown.querySelector(`.${INPUT}`);
    this.dropdownContent = this.dropdown.querySelector(`.${CONTENT}`);
    this.btnClear = this.dropdown.querySelector(`.${BTN_CLEAR}`);
    this.btnAccept = this.dropdown.querySelector(`.${BTN_ACCEPT}`);
    this.counter = this.dropdown.querySelector(`.${COUTER}`);
    this.btnsDecrement = this.counter.querySelectorAll(
      `.${BTNS_DEC}`,
    );
    this.btnsIncrement = this.counter.querySelectorAll(
      `.${BTNS_INC}`,
    );
  }

  checkUrlDates() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dropdownUrlContent = urlParams.get('dropdown');
    const type = urlParams.get('type');

    if (dropdownUrlContent && type === this.type) {
      Dropdown.addInputValue(this.dropdownInput, dropdownUrlContent);

      const params = window.location.search
        .replace('?', '')
        .split('&')
        .reduce((p, e) => {
          const a = e.split('=');
          // eslint-disable-next-line no-param-reassign
          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        }, {});

      const allCounts = this.dropdown.querySelectorAll(`.${COUNT}`);
      allCounts.forEach((e) => {
        e.value = params[e.dataset.item];
      });
    }
  }

  addListeners() {
    this.field.addEventListener('click', this.toggleClass.bind(this));
    this.field.addEventListener('click', () => {
      this.dropdownContent.classList.toggle('_active');
    });

    this.btnsDecrement.forEach((item) => item.addEventListener('click', this.decrementBtn.bind(this)));
    this.btnsIncrement.forEach((item) => item.addEventListener('click', this.incrementBtn.bind(this)));

    this.btnClear.addEventListener('click', this.clear.bind(this));
    this.btnAccept.addEventListener('click', this.accept.bind(this));

    document.addEventListener('click', this.closeOuterClick.bind(this));
  }

  closeOuterClick({ target }) {
    if (target.closest('.dropdown')) return;
    if (this.field.classList.contains('_opened')) {
      this.field.classList.remove('_opened');
    }
    if (this.dropdownContent.classList.contains('_active')) {
      this.dropdownContent.classList.remove('_active');
    }
  }

  performData(selector, data) {
    this.wordsMap = Dropdown.createObjectMap(data);
    this.countsMap = this.createCountsMap(selector);
    this.synthMap = Dropdown.joinMap(this.wordsMap, this.countsMap);
    this.string = Dropdown.createStrMap(this.synthMap);
    Dropdown.addInputValue(this.dropdownInput, this.string);
  }

  static createObjectMap(arrObj) {
    const optMap = new Map();
    arrObj.forEach((e) => {
      Object.entries(e).forEach((arr) => {
        const [key, value] = arr;
        optMap.set(key, value);
      });
    });

    return optMap;
  }

  createCountsMap(selector) {
    const countMap = new Map();
    const counts = [...this.dropdown.querySelectorAll(selector)].filter(
      (e) => Number(e.value) > 0,
    );

    counts.forEach((count) => {
      if (Number.isNaN(Number(count.value))) {
        throw new ValidationError('Ошибка в чтении значения counter');
      }
      countMap.set(count.dataset.item, Number(count.value));
    });

    return countMap;
  }

  checkBtnVisibility(container, selector) {
    const [...counts] = container.querySelectorAll(selector);
    const countValues = [];
    counts.forEach((e) => countValues.push(Number(e.value)));
    const sum = countValues.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0,
    );

    if (sum > 0) this.btnClear.style.visibility = 'visible';
    if (sum === 0) this.btnClear.style.visibility = 'hidden';
  }

  decrementBtn(e) {
    e.preventDefault();
    const container = e.target.closest(`.${ITEM}`);
    const count = container.querySelector(`.${COUNT}`);
    Dropdown.checkLimits(count);
    if (
      Number(count.value) > 0
      && e.target.classList.contains(DISABLED)
    ) {
      e.target.classList.remove(DISABLED);
    }
    if (e.target.classList.contains(DISABLED)) return;
    count.value = Number(count.value) - 1;
    if (Number(count.value) === 0) {
      e.target.classList.add(DISABLED);
    }
    this.performData(`.${COUNT}`, this.options);
    this.checkBtnVisibility(this.dropdown, `.${COUNT}`);
  }

  incrementBtn(e) {
    e.preventDefault();
    const container = e.target.closest(`.${ITEM}`);
    const count = container.querySelector(`.${COUNT}`);
    const decrement = container.querySelector(`.${BTNS_DEC}`);
    Dropdown.checkLimits(count);
    if (Number(count.value) === 999) return;
    count.value = Number(count.value) + 1;
    if (Number(count.value) > 0) {
      decrement.classList.remove(DISABLED);
    }
    this.performData(`.${COUNT}`, this.options);
    this.checkBtnVisibility(this.dropdown, `.${COUNT}`);
  }

  clear(e) {
    e.preventDefault();
    this.dropdownInput.value = '';
    const [...counts] = this.dropdown.querySelectorAll(`.${COUNT}`);
    // eslint-disable-next-line no-return-assign, no-shadow
    counts.forEach((e) => (e.value = 0));
    this.checkBtnVisibility(this.dropdown, `.${COUNT}`);
  }

  accept(e) {
    e.preventDefault();
    this.dropdownContent.classList.remove('_active');
  }

  toggleClass() {
    this.field.classList.toggle('_opened');
  }

  static joinMap(wordsMap, countsMap) {
    const synthMap = new Map();

    countsMap.forEach((key, value) => {
      if (wordsMap.has(value) && !Dropdown.hasIsEqualKey(synthMap, wordsMap.get(value))) {
        // If new map hasn't kthe key
        synthMap.set(wordsMap.get(value), key);
      }
      // If the map of array hasn't separate array for the key
      if (!wordsMap.has(value) && synthMap.has(wordsMap.get(DEFAULT_KEY))) {
        // If there is correct array of words
        // sum all keys countsMap and set in value
        const newValue = Dropdown.sumCounts(countsMap, wordsMap, DEFAULT_KEY);
        synthMap.set(wordsMap.get(DEFAULT_KEY), newValue);
      }

      // If there is not array of words
      if (!wordsMap.has(value) && !synthMap.has(wordsMap.get(DEFAULT_KEY))) {
        synthMap.set(wordsMap.get(DEFAULT_KEY), key);
      }
    });
    return synthMap;
  }

  static createStrMap(map) {
    const arrStrings = [];
    map.forEach((key, value) => {
      arrStrings.push(`${key} ${chooseWord(key, value)}`);
    });

    const result = arrStrings.join(', ');
    return result;
  }

  static addInputValue(input, value) {
    // eslint-disable-next-line no-param-reassign
    input.value = cutString(value, 20);
  }

  static hasIsEqualKey(compareMap, arr) {
    // eslint-disable-next-line consistent-return
    compareMap.forEach((_, value) => {
      if (isEqual(value, arr)) return true;
    });
    return false;
  }

  static sumCounts(countsMap, wordsMap, indicator) {
    const arrKyes = [];
    countsMap.forEach((key, value) => {
      if (value !== indicator && !wordsMap.has(value)) {
        arrKyes.push(key);
      }
    });
    const reusult = arrKyes.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      0,
    );
    return reusult;
  }

  static checkLimits(countEl) {
    // eslint-disable-next-line no-param-reassign
    if (Number(countEl.value) > 999) countEl.value = 999;
    // eslint-disable-next-line no-param-reassign
    if (Number(countEl.value) < 0) countEl.value = 0;
  }
}

export default Dropdown;
