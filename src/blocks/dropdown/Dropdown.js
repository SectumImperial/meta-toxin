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
      console.error('Error in reading options', err);
    }

    this.handleFieldClick = this.handleFieldClick.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleDecrBtnClick = this.handleDecrBtnClick.bind(this);
    this.handleIncrBtnClick = this.handleIncrBtnClick.bind(this);
    this.handleBtnClearClick = this.handleBtnClearClick.bind(this);
    this.handleBtnAcceptClick = this.handleBtnAcceptClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);

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

  static hasIsEqualKey(compareMap, arr) {
    compareMap.forEach((_, value) => {
      if (isEqual(value, arr)) return true;
      return false;
    });
  }

  static sumCounts(countsMap, wordsMap, indicator) {
    let arrKeys = [];
    countsMap.forEach((key, value) => {
      if (value !== indicator && !wordsMap.has(value)) {
        arrKeys = [...arrKeys, key];
      }
    });
    const result = arrKeys.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      0,
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
    this.isRestricted = false;
    this.options.forEach((e) => {
      if (e.isRestricted) this.isRestricted = true;
    });
  }

  #addListeners() {
    this.field.addEventListener('click', this.handleFieldClick);

    this.dropdownInput.addEventListener('keydown', this.handleInputKeyDown);

    this.buttonsDecrement.forEach((item) => item.addEventListener('click', this.handleDecrBtnClick));
    this.buttonsIncrement.forEach((item) => item.addEventListener('click', this.handleIncrBtnClick));

    this.btnClear.addEventListener('click', this.handleBtnClearClick);
    this.btnAccept.addEventListener('click', this.handleBtnAcceptClick);

    document.addEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick({ target }) {
    if (target.closest('.dropdown')) return;
    if (this.field.classList.contains(OPENED)) {
      this.field.classList.remove(OPENED);
    }
    if (this.dropdownContent.classList.contains(ACTIVE)) {
      this.dropdownContent.classList.remove(ACTIVE);
    }
  }

  handleInputKeyDown(e) {
    const { code } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.dropdownContent.classList.toggle(ACTIVE);
    }
  }

  handleDecrBtnClick(e) {
    e.preventDefault();
    const { target } = e;
    const container = target.closest(`.${ITEM}`);
    const count = container.querySelector(`.${COUNT_ELEM}`);
    count.value = Dropdown.checkLimits(count);
    count.value = Dropdown.decrementValue(count, target);
    Dropdown.checkDecrementDisabled(count, target);

    if (this.isRestricted) this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  handleIncrBtnClick(e) {
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

    if (this.isRestricted) this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  handleBtnClearClick(e) {
    e.preventDefault();
    let placeholderValue = 'Enter the data';
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

  handleBtnAcceptClick(e) {
    e.preventDefault();
    this.dropdownContent.classList.remove(ACTIVE);
    this.field.classList.remove(OPENED);
  }

  handleFieldClick() {
    this.dropdownContent.classList.toggle(ACTIVE);
    this.field.classList.toggle(OPENED);
  }

  #checkBtnVisibility() {
    let countValues = [];
    this.counts.forEach((e) => {
      countValues = [...countValues, Number(e.value)];
    });
    const sum = countValues.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0,
    );

    if (sum > 0) this.btnClear.classList.remove(HIDDEN);
    if (sum === 0) this.btnClear.classList.add(HIDDEN);
  }

  #addURLValues() {
    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);

    this.counts.forEach((e) => {
      if (URLParams.get(e.dataset.item)) {
        e.value = URLParams.get(e.dataset.item);
        Dropdown.checkDecrementDisabled(e.value, e);
      }
    });
    if (this.isRestricted) this.#checkInfants();
    this.#performData();
    this.#checkBtnVisibility();
  }

  #addPreset() {
    if (this.preset.length === 0) return;
    this.preset.forEach((e) => {
      const key = Object.keys(e).join('');
      const value = Object.values(e).join('');
      const count = this.dropdown.querySelector(
        `.${COUNT_ELEM}[data-item="${key}"]`,
      );
      if (count === undefined || count === null) return;
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
        console.error('Error in reading counter value');
      }
      countMap.set(count.dataset.item, Number(count.value));
    });

    return countMap;
  }

  #checkInfants() {
    const counts = Array.from(this.counts, (e) => e.value);
    const sum = counts.reduce((prev, curr) => Number(prev) + Number(curr), 0);
    const infantCount = this.dropdown.querySelector(
      `.${COUNT_ELEM}[data-item="Младенцы"]`,
    ).value;
    const adult = this.dropdown.querySelector(
      `.${COUNT_ELEM}[data-item="Взрослые"]`,
    );
    const adultCount = adult.value;

    const adultDecrementBtn = adult
      .closest('.dropdown__items-nav')
      .querySelector(`.${BUTTONS_DEC}`);
    if (sum <= Number(infantCount) && sum !== 0 && Number(infantCount) !== 0) {
      adult.value = Number(adultCount) + 1;
      adultDecrementBtn.classList.add(DISABLED);
      Dropdown.addDisabledForButton(adultDecrementBtn);
    } else if (Number(adultCount) !== 0) {
      adultDecrementBtn.classList.remove(DISABLED);
      Dropdown.removeDisabledForButton(adultDecrementBtn);
    }

    if (Number(infantCount) > 0 && Number(adultCount) === 1) {
      adultDecrementBtn.classList.add(DISABLED);
      Dropdown.addDisabledForButton(adultDecrementBtn);
    }
  }

  #joinMap() {
    const synthMap = new Map();

    this.countsMap.forEach((key, value) => {
      if (
        this.wordsMap.has(value)
        && !Dropdown.hasIsEqualKey(synthMap, this.wordsMap.get(value))
      ) {
        synthMap.set(this.wordsMap.get(value), key);
      }
      if (
        !this.wordsMap.has(value)
        && synthMap.has(this.wordsMap.get(DEFAULT_KEY))
      ) {
        const newValue = Dropdown.sumCounts(
          this.countsMap,
          this.wordsMap,
          DEFAULT_KEY,
        );
        synthMap.set(this.wordsMap.get(DEFAULT_KEY), newValue);
      }

      if (
        !this.wordsMap.has(value)
        && !synthMap.has(this.wordsMap.get(DEFAULT_KEY))
      ) {
        synthMap.set(this.wordsMap.get(DEFAULT_KEY), key);
      }
    });
    return synthMap;
  }

  #createStrMap() {
    let arrStrings = [];
    this.synthMap.forEach((key, value) => {
      arrStrings = [...arrStrings, `${key} ${chooseWord(key, value)}`];
    });

    const result = arrStrings.join(', ');
    return result;
  }

  #addInputValue(str) {
    if (str.length === 0) {
      this.dropdownInput.innerText = this.wordsMap.get('placeholder');
    } else {
      this.dropdownInput.innerText = cutString(str, 20);
    }
    return this;
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
    return this;
  }
}

export default Dropdown;
