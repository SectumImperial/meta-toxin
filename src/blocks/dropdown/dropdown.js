import ValidationError from './helpers/error.js';
import chooseWord from '../../helpers/chooseWord';
import isEqual from './helpers/isEqual';
import cutString from './helpers/cutString';
import DEFAULT_KEY from './constants.js';

class Dropdown {
  constructor(element) {
    this.dropdown = element;

    try {
      this.options = JSON.parse(this.dropdown.dataset.options);
    } catch (err) {
      throw new ValidationError('Ошибка в чтении options', err);
    }

    try {
      this.init();
    } catch (err) {
      throw new Error('Ошибка инициализации класса', err);
    }
  }

  init() {
    this.field = this.dropdown.querySelector('.dropdown__input-field');
    this.dropdownInput = this.dropdown.querySelector('.dropdown__input');
    this.dropdownContent = this.dropdown.querySelector('.dropdown__content');
    this.btnClear = this.dropdown.querySelector('.dropdown__button_clear');
    this.btnAccept = this.dropdown.querySelector('.dropdown__button_accept');
    this.checkBtnVisibility(this.dropdown, '.dropdown__count');
    this.counter = this.dropdown.querySelector('.dropdown__counter');
    this.btnsDecrement = this.counter.querySelectorAll(
      '.dropdown__btn_decrement',
    );
    this.btnsIncrement = this.counter.querySelectorAll(
      '.dropdown__btn_increment',
    );

    this.type = this.dropdown.querySelector('._dropdown__type').value;

    this.addListeners();
    this.checkUrlDates();
  }

  checkUrlDates() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dropdownUrlContent = urlParams.get('dropdown');
    const type = urlParams.get('type');

    if (dropdownUrlContent && type === this.type) {
      this.addInputValue(this.dropdownInput, dropdownUrlContent);

      const params = window.location.search
        .replace('?', '')
        .split('&')
        .reduce((p, e) => {
          const a = e.split('=');
          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        }, {});

      const allCounts = this.dropdown.querySelectorAll('.dropdown__count');
      allCounts.forEach((e) => {
        e.value = params[e.dataset.item];
      });
    }
  }

  addListeners() {
    this.field.addEventListener('click', this.toggleClass.bind(this));
    this.field.addEventListener('click', (e) => {
      this.dropdownContent.classList.toggle('_active');
    });

    this.btnsDecrement.forEach((item) => item.addEventListener('click', this.btnDecrement.bind(this)));
    this.btnsIncrement.forEach((item) => item.addEventListener('click', this.btnIncrement.bind(this)));

    this.btnClear.addEventListener('click', this.clear.bind(this));
    this.btnAccept.addEventListener('click', this.accept.bind(this));

    document.addEventListener('click', this.closeOuterClick.bind(this));
  }

  closeOuterClick({ target }) {
    if (target.closest('.dropdown')) return;
    if (this.field.classList.contains('_opened')) { this.field.classList.remove('_opened'); }
    if (this.dropdownContent.classList.contains('_active')) { this.dropdownContent.classList.remove('_active'); }
  }

  performData(selector, data) {
    this.wordsMap = this.createObjectMap(data);
    this.countsMap = this.createCountsMap(selector);
    this.synthMap = this.joinMap(this.wordsMap, this.countsMap);
    this.string = this.createStrMap(this.synthMap);
    this.addInputValue(this.dropdownInput, this.string);
  }

  createObjectMap(arrObj) {
    const optMap = new Map();
    for (const obj of arrObj) {
      for (const [key, value] of Object.entries(obj)) {
        optMap.set(key, value);
      }
    }

    return optMap;
  }

  createCountsMap(selector) {
    const countMap = new Map();
    const counts = [...this.dropdown.querySelectorAll(selector)].filter(
      (e) => Number(e.value) > 0,
    );
    for (const count of counts) {
      if (Number.isNaN(Number(count.value))) {
        throw new ValidationError('Ошибка в чтении значения counter', err);
      }
      countMap.set(count.dataset.item, Number(count.value));
    }
    return countMap;
  }

  joinMap(wordsMap, countsMap) {
    const synthMap = new Map();
    for (const [key, value] of countsMap) {
      // Если в карте массива слов есть отдельный массив для ключа
      if (wordsMap.has(key)) {
        // Если создаваемая карта не имеет такого ключа
        if (!this.hasIsEqualKey(synthMap, wordsMap.get(key))) {
          synthMap.set(wordsMap.get(key), value);
        }
      }

      // Если в карте массива слов нет отдельного массива для ключа
      if (!wordsMap.has(key)) {
        // Если создаваемая карта уже имеет нужный массив слов
        if (synthMap.has(wordsMap.get(DEFAULT_KEY))) {
          // перебрать и суммировать подходящие ключи countsMap, после установить в качестве value
          const value = this.sumCounts(countsMap, wordsMap, DEFAULT_KEY);
          synthMap.set(wordsMap.get(DEFAULT_KEY), value);
        }

        // Если создаваемая карта ещё не имеет нужный массив слов
        if (!synthMap.has(wordsMap.get(DEFAULT_KEY))) {
          synthMap.set(wordsMap.get(DEFAULT_KEY), value);
        }
      }
    }

    return synthMap;
  }

  createStrMap(map) {
    const arrStrings = [];
    for (const [key, value] of map) {
      arrStrings.push(`${value} ${chooseWord(value, key)}`);
    }

    const result = arrStrings.join(', ');
    return result;
  }

  addInputValue(input, value) {
    input.value = cutString(value, 20);
  }

  hasIsEqualKey(compareMap, arr) {
    for (const [key] of compareMap) {
      if (isEqual(key, arr)) return true;
    }

    return false;
  }

  sumCounts(countsMap, wordsMap, indicator) {
    const arrKyes = [];
    for (const [key, value] of countsMap) {
      if (key !== indicator && !wordsMap.has(key)) {
        arrKyes.push(value);
      }
    }
    const reusult = arrKyes.reduce((prev, curr) => Number(prev) + Number(curr), 0);
    return reusult;
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

  btnDecrement(e) {
    e.preventDefault();
    const container = e.target.closest('.dropdown__item');
    const count = container.querySelector('.dropdown__count');
    this.checkLimits(count);
    if (
      Number(count.value) > 0
      && e.target.classList.contains('dropdown__btn_disabled')
    ) { e.target.classList.remove('dropdown__btn_disabled'); }
    if (e.target.classList.contains('dropdown__btn_disabled')) return;
    count.value = Number(count.value) - 1;
    if (Number(count.value) === 0) { e.target.classList.add('dropdown__btn_disabled'); }
    this.performData('.dropdown__count', this.options);
    this.checkBtnVisibility(this.dropdown, '.dropdown__count');
  }

  btnIncrement(e) {
    e.preventDefault();
    const container = e.target.closest('.dropdown__item');
    const count = container.querySelector('.dropdown__count');
    const decrement = container.querySelector('.dropdown__btn_decrement');
    this.checkLimits(count);
    if (Number(count.value) === 999) return;
    count.value = Number(count.value) + 1;
    if (Number(count.value) > 0) { decrement.classList.remove('dropdown__btn_disabled'); }
    this.performData('.dropdown__count', this.options);
    this.checkBtnVisibility(this.dropdown, '.dropdown__count');
  }

  checkLimits(countEl) {
    if (Number(countEl.value) > 999) countEl.value = 999;
    if (Number(countEl.value) < 0) countEl.value = 0;
  }

  clear(e) {
    e.preventDefault();
    this.dropdownInput.value = '';
    const [...counts] = this.dropdown.querySelectorAll('.dropdown__count');
    counts.forEach((e) => (e.value = 0));
    this.checkBtnVisibility(this.dropdown, '.dropdown__count');
  }

  accept(e) {
    e.preventDefault();
    this.dropdownContent.classList.remove('_active');
  }

  toggleClass() {
    this.field.classList.toggle('_opened');
  }
}

export default Dropdown;
