import chooseWord from '@helpers/chooseWord';
import isEqual from './helpers/isEqual';
import cutString from './helpers/cutString';

import {
  DEFAULT_KEY,
  FIELD,
  INPUT,
  CONTENT,
  BTN_CLEAR,
  BTN_ACCEPT,
  COUNT_ELEM,
  COUNTER,
  BUTTONS_DEC,
  BUTTONS_INC,
  TYPE,
  ITEM,
  DISABLED,
  ACTIVE,
  OPENED,
  HIDDEN,
  LABEL,
} from './constants';

class Dropdown {
  constructor(element) {
    this.dropdown = element;

    try {
      this.options = JSON.parse(this.dropdown.dataset.options);
    } catch (err) {
      throw new Error('Ошибка в чтении options', err);
    }
    this.init();
  }

  init() {
    this.#findElements();
    this.#checkBtnVisibility();
    this.#addListeners();
    this.#addURLValues();
    this.#addPreset();
    this.#checkDecrementButtonDisabled();
  }

  #findElements() {
    this.preset = JSON.parse(this.dropdown.dataset.preset);
    this.field = this.dropdown.querySelector(`.${FIELD}`);
    this.label = this.dropdown.querySelector(`.${LABEL}`);
    this.dropdownInput = this.dropdown.querySelector(`.${INPUT}`);
    this.dropdownContent = this.dropdown.querySelector(`.${CONTENT}`);
    this.btnClear = this.dropdown.querySelector(`.${BTN_CLEAR}`);
    this.btnAccept = this.dropdown.querySelector(`.${BTN_ACCEPT}`);
    this.counter = this.dropdown.querySelector(`.${COUNTER}`);
    this.buttonsDecrement = this.counter.querySelectorAll(`.${BUTTONS_DEC}`);
    this.buttonsIncrement = this.counter.querySelectorAll(`.${BUTTONS_INC}`);

    this.counts = this.dropdown.querySelectorAll(`.${COUNT_ELEM}`);
    this.type = this.dropdown.querySelector(`.${TYPE}`).value;
  }

  #addListeners() {
    this.field.addEventListener('click', this.#handleFieldClick.bind(this));
    this.field.addEventListener('click', () => {
      this.dropdownContent.classList.toggle(ACTIVE);
    });
    if (this.label)
      this.label.addEventListener('click', (e) => e.preventDefault());

    this.dropdownInput.addEventListener(
      'keydown',
      this.#handleInputKeyDown.bind(this)
    );

    this.buttonsDecrement.forEach((item) =>
      item.addEventListener('click', this.#handleDecrBtnClick.bind(this))
    );
    this.buttonsIncrement.forEach((item) =>
      item.addEventListener('click', this.#handleIncrBtnClick.bind(this))
    );

    this.btnClear.addEventListener(
      'click',
      this.#handleBtnClearClick.bind(this)
    );
    this.btnAccept.addEventListener(
      'click',
      this.#handleBtnAcceptClick.bind(this)
    );

    document.addEventListener('click', this.#handleDocumentClick.bind(this));
  }

  #handleDocumentClick({ target }) {
    if (target.closest('.dropdown')) return;
    if (this.field.classList.contains(OPENED)) {
      this.field.classList.remove(OPENED);
    }
    if (this.dropdownContent.classList.contains(ACTIVE)) {
      this.dropdownContent.classList.remove(ACTIVE);
    }
  }

  #handleInputKeyDown(e) {
    const { code } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.dropdownContent.classList.toggle(ACTIVE);
    }
  }

  #checkBtnVisibility() {
    const countValues = [];
    this.counts.forEach((e) => countValues.push(Number(e.value)));
    const sum = countValues.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );

    if (sum > 0) this.btnClear.classList.remove(HIDDEN);
    if (sum === 0) this.btnClear.classList.add(HIDDEN);
  }

  #handleDecrBtnClick(e) {
    e.preventDefault();
    const { target } = e;
    const container = target.closest(`.${ITEM}`);
    const count = container.querySelector(`.${COUNT_ELEM}`);
    count.value = Dropdown.checkLimits(count);
    count.value = Dropdown.decrementValue(count, target);
    Dropdown.checkDecrementDisabled(count, target);

    if (this.type === 'guests-dropdown') this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  #handleIncrBtnClick(e) {
    e.preventDefault();
    const { target } = e;
    const container = target.closest(`.${ITEM}`);
    const count = container.querySelector(`.${COUNT_ELEM}`);
    const decrement = container.querySelector(`.${BUTTONS_DEC}`);
    count.value = Dropdown.checkLimits(count);
    if (Number(count.value) === 999) return;
    count.value = Number(count.value) + 1;
    if (Number(count.value) > 0) {
      decrement.classList.remove(DISABLED);
      decrement.disabled = false;
    }

    if (this.type === 'guests-dropdown') this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  #handleBtnClearClick(e) {
    e.preventDefault();
    let placeholderValue = 'Введите данные';
    this.options.forEach((element) => {
      if (element.placeholder) placeholderValue = element.placeholder;
    });
    this.dropdownInput.value = placeholderValue;
    this.counts.forEach((count) => {
      const element = count.closest(`.${COUNT_ELEM}`);
      element.value = 0;
    });

    this.#checkBtnVisibility();
  }

  #handleBtnAcceptClick(e) {
    e.preventDefault();
    this.dropdownContent.classList.remove(ACTIVE);
    this.field.classList.remove(OPENED);
  }

  #handleFieldClick() {
    this.field.classList.toggle(OPENED);
  }

  #addURLValues() {
    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);
    const type = URLParams.get('type');

    this.counts.forEach((e) => {
      if (URLParams.get(e.dataset.item) && type === this.type) {
        e.value = URLParams.get(e.dataset.item);
        Dropdown.checkDecrementDisabled(e.value, e);
      }
    });
    if (this.type === 'guests-dropdown') this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  #addPreset() {
    if (this.preset.length === 0) return;
    this.preset.forEach((e) => {
      const key = Object.keys(e).join('');
      const value = Object.values(e).join('');
      const count = this.dropdown.querySelector(
        `.${COUNT_ELEM}[data-item="${key}"]`
      );
      if (!count) return;
      count.value = value;
      this.#performData();
      this.#checkBtnVisibility();
    });
  }

  #performData() {
    this.wordsMap = this.#createObjectMap();
    this.countsMap = this.#createCountsMap();
    this.synthMap = this.#joinMap();
    this.string = this.#createStrMap();
    this.#addInputValue(this.string);
  }

  #createObjectMap() {
    const optMap = new Map();
    this.options.forEach((e) => {
      Object.entries(e).forEach((arr) => {
        const [key, value] = arr;
        optMap.set(key, value);
      });
    });
    return optMap;
  }

  #createCountsMap() {
    const countMap = new Map();
    const counts = [...this.counts].filter((e) => Number(e.value) > 0);

    counts.forEach((count) => {
      if (Number.isNaN(Number(count.value))) {
        throw new Error('Error in reading counter value');
      }
      countMap.set(count.dataset.item, Number(count.value));
    });

    return countMap;
  }

  #checkInfants() {
    const counts = Array.from(this.counts, (e) => e.value);
    const sum = counts.reduce((prev, curr) => Number(prev) + Number(curr), 0);
    const infantCount = this.dropdown.querySelector(
      `.${COUNT_ELEM}[data-item="Младенцы"]`
    ).value;
    const adult = this.dropdown.querySelector(
      `.${COUNT_ELEM}[data-item="Взрослые"]`
    );
    const adultDecrementBtn = adult
      .closest('.dropdown__items-nav')
      .querySelector(`.${BUTTONS_DEC}`);
    if (sum <= infantCount && sum !== 0 && infantCount !== 0) {
      adult.value = Number(adult.value) + 1;
      adultDecrementBtn.classList.add(DISABLED);
      Dropdown.addDisabledForButton(adultDecrementBtn);
    } else if (Number(adult.value) !== 0) {
      adultDecrementBtn.classList.remove(DISABLED);
      Dropdown.removeDisabledForButton(adultDecrementBtn);
    }
  }

  #joinMap() {
    const synthMap = new Map();

    this.countsMap.forEach((key, value) => {
      if (
        this.wordsMap.has(value) &&
        !Dropdown.hasIsEqualKey(synthMap, this.wordsMap.get(value))
      ) {
        synthMap.set(this.wordsMap.get(value), key);
      }
      if (
        !this.wordsMap.has(value) &&
        synthMap.has(this.wordsMap.get(DEFAULT_KEY))
      ) {
        const newValue = Dropdown.sumCounts(
          this.countsMap,
          this.wordsMap,
          DEFAULT_KEY
        );
        synthMap.set(this.wordsMap.get(DEFAULT_KEY), newValue);
      }

      if (
        !this.wordsMap.has(value) &&
        !synthMap.has(this.wordsMap.get(DEFAULT_KEY))
      ) {
        synthMap.set(this.wordsMap.get(DEFAULT_KEY), key);
      }
    });
    return synthMap;
  }

  #createStrMap() {
    const arrStrings = [];
    this.synthMap.forEach((key, value) => {
      arrStrings.push(`${key} ${chooseWord(key, value)}`);
    });

    const result = arrStrings.join(', ');
    return result;
  }

  #addInputValue(str) {
    if (str === '') {
      this.dropdownInput.innerText = this.wordsMap.get('placeholder');
    } else {
      this.dropdownInput.innerText = cutString(str, 20);
    }
  }

  #checkDecrementButtonDisabled() {
    const countElements = this.dropdown.querySelectorAll(`.${COUNT_ELEM}`);
    countElements.forEach((countElement) => {
      if (Number(countElement.value) > 0) {
        Dropdown.removeDisabledForButton(countElement);
      }
      if (Number(countElement.value) === 0) {
        Dropdown.addDisabledForButton(countElement);
      }
    });
  }

  static hasIsEqualKey(compareMap, arr) {
    compareMap.forEach((_, value) => {
      if (isEqual(value, arr)) return true;
      return false;
    });
  }

  static sumCounts(countsMap, wordsMap, indicator) {
    const arrKeys = [];
    countsMap.forEach((key, value) => {
      if (value !== indicator && !wordsMap.has(value)) {
        arrKeys.push(key);
      }
    });
    const result = arrKeys.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      0
    );
    return result;
  }

  static checkLimits(countEl) {
    if (Number(countEl.value) > 999) return 999;
    if (Number(countEl.value) < 0) return 0;
    return Number(countEl.value);
  }

  static checkDecrementDisabled(count, target) {
    if (Number(count.value) === 0) {
      target.classList.add(DISABLED);
      Dropdown.addDisabledForButton(target);
    } else {
      Dropdown.removeDisabledForButton(target);
    }
  }

  static decrementValue(count, target) {
    if (Number(count.value) > 0 && target.classList.contains(DISABLED)) {
      target.classList.remove(DISABLED);
      Dropdown.removeDisabledForButton(target);
    }
    if (target.classList.contains(DISABLED)) return count.value;
    return Number(count.value) - 1;
  }

  static removeDisabledForButton(target) {
    const container = target.closest(`.${ITEM}`);
    const button = container.querySelector(`.${BUTTONS_DEC}`);
    button.disabled = false;
    button.classList.remove(DISABLED);
  }

  static addDisabledForButton(target) {
    const container = target.closest(`.${ITEM}`);
    const button = container.querySelector(`.${BUTTONS_DEC}`);
    button.disabled = true;
    button.classList.add(DISABLED);
  }
}

export default Dropdown;
