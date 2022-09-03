import AirDatepicker from 'air-datepicker';
import { v4 as uuidv4 } from 'uuid';

import {
  MONTS,
  ITEM,
  DATEPICK_2,
  DATEPICK_1,
  START,
  END,
  ACCEPT,
  CLEAR,
  GROUP,
  CONTAINER,
  DATES,
  DATEPICK,
  ACTIVE,
  CLICKED,
  LABEL,
} from './constants';

class Datepicker {
  constructor(element) {
    this.datepick = element;
    this.init();
  }

  init() {
    this.#findElems(this.datepick);
    this.#createId();
    this.#createDatepicker();
    this.#addButtonsArrow();
    this.#checkBtnVisibility([...this.items]);
    this.#addListeners();
  }

  #findElems(container) {
    this.items = container.querySelectorAll(`.${ITEM}`);
    this.formGroups = Array.from(
      container.querySelectorAll(`.${GROUP}`),
    );
    this.buttonClear = container.querySelector(`.${CLEAR}`);
    this.buttonAccept = container.querySelector(`.${ACCEPT}`);

    this.isSingleInput = false;
    this.isTwoInputs = false;
    if (container.classList.contains(DATEPICK_1)) this.isSingleInput = true;
    if (container.classList.contains(DATEPICK_2)) this.isTwoInputs = true;
    this.rangeFrom = null;
    this.rangeTo = null;
  }

  #createId() {
    this.formGroups.forEach((e) => {
      const label = e.querySelector(`.${LABEL}`);
      const input = e.querySelector(`.${ITEM}`);
      const id = uuidv4();
      label.htmlFor = id;
      input.id = id;
    });
  }

  #createDatepicker() {
    this.calConteiner = this.datepick.querySelector(`.${CONTAINER}`);
    this.dp = new AirDatepicker(this.calConteiner, {
      range: true,
    });
    this.dp.show();

    if (this.isTwoInputs) {
      this.firstItem = this.datepick.querySelector(`.${START}`);
      this.secondItem = this.datepick.querySelector(`.${END}`);
    }

    if (this.isSingleInput) {
      this.singleItem = this.datepick.querySelector(`.${DATES}`);
    }

    this.#formatTitle();
    if (Datepicker.getUrlParams()) {
      this.#getUrlValues();
    } else {
      this.setPrev();
    }
  }

  #addListeners() {
    this.datepick.addEventListener('click', this.#clickInputOpen.bind(this));
    this.buttonClear.addEventListener('click', this.#clear.bind(this));
    this.buttonAccept.addEventListener('click', this.#accept.bind(this));
    this.items.forEach((item) => {
      item.addEventListener('input', this.#inputDate.bind(this));
    });
    this.calConteiner.addEventListener('click', this.#checkRange.bind(this));
    this.datepick.addEventListener('mousemove', this.#setRange.bind(this));
    document.addEventListener('click', this.#closeOuterClick.bind(this));

    this.items.forEach((item) => item.addEventListener('keydown', this.#handleKey.bind(this)));
  }

  #closeOuterClick({ target }) {
    if (target.closest(`.${DATEPICK}`)) return;
    this.datepick.querySelectorAll(`.${GROUP}`).forEach((e) => {
      if (e.classList.contains(CLICKED)) e.classList.remove(CLICKED);
      if (this.calConteiner.classList.contains(ACTIVE)) {
        this.#closeDp();
      }
    });
  }

  #handleKey(e) {
    const { code } = e;
    if (code === 'Space') {
      e.preventDefault();
      this.#clickInputOpen(e);
    }
  }

  static getUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const startUrlDateString = urlParams.get('datepick-input-start');
    const endUrlDateString = urlParams.get('datepick-input-end');

    if ((startUrlDateString, endUrlDateString)) {
      return [startUrlDateString, endUrlDateString];
    }
    return false;
  }

  #getUrlValues() {
    if (this.isSingleInput) {
      const [startUrlDateString, endUrlDateString] = Datepicker.getUrlParams();

      if ((startUrlDateString, endUrlDateString)) {
        const [firstDay, firstmonth, firstyear] = startUrlDateString.split('.');
        const [secondDay, secondmonth, secondyear] = endUrlDateString.split('.');

        const startDate = new Date(firstyear, firstmonth - 1, firstDay);
        const endDate = new Date(secondyear, secondmonth - 1, secondDay);

        this.dp.selectDate([startDate, endDate]);
        this.singleItem.value = Datepicker.formatDate({
          firstDate: startDate,
          secondDate: endDate,
          mod: 'singleInputMod',
        });
        this.#setPointRange();
        this.#performRange(this.rangeFrom, this.rangeTo);
      }
    }
  }

  #checkBtnVisibility(itemsArr) {
    let addedValue;
    if (this.isTwoInputs) {
      addedValue = itemsArr.every((e) => e.value !== '');
    }

    if (this.isSingleInput) {
      addedValue = this.singleItem.value !== '';
    }

    if (addedValue) this.buttonClear.style.visibility = 'visible';
    if (!addedValue) this.buttonClear.style.visibility = 'hidden';
  }

  // Methods of selecting range
  #performRange(rangeFrom, rangeTo) {
    this.#clearRange('start-range');
    this.#clearRange('end-range');
    Datepicker.deletePoitRange(rangeFrom);
    Datepicker.deletePoitRange(rangeTo);
    this.#addPoitRange(rangeFrom, rangeTo);
  }

  #clearRange(rangeLineClass) {
    const elems = [...this.datepick.querySelectorAll(`.${rangeLineClass}`)];
    if (elems.length === 0) return;
    elems.forEach((el) => {
      if (
        !el.classList.contains(rangeLineClass)
        && !el.classList.contains('-selected-')
      ) {
        el.classList.remove(rangeLineClass);
      }

      if (
        !el.classList.contains('-selected-')
        && !el.classList.contains('-focus-')
      ) {
        el.classList.remove(rangeLineClass);
      }
    });
  }

  #removeRange() {
    this.rangeFrom.classList.remove('end-range');
    this.rangeFrom.classList.remove('start-range');
  }

  #setPointRange() {
    this.rangeFrom = this.datepick.querySelector('.-range-from-');
    this.rangeTo = this.datepick.querySelector('.-range-to-');
  }

  #addPoitRange() {
    if (Datepicker.isRangeSelecting(this.rangeFrom, 'start-range')) {
      this.rangeFrom.classList.add('start-range');
    }

    if (
      Datepicker.isRangeSelecting(this.rangeTo, 'end-range')
    ) {
      this.rangeTo.classList.add('end-range');
    }
  }

  #isSameDateHover() {
    return this.rangeFrom
      && this.rangeFrom.classList.contains('-focus-')
      && this.rangeFrom.classList.contains('-range-to-')
      && this.rangeFrom.classList.contains('-range-from-')
      && this.rangeFrom.classList.contains('-selected-');
  }

  #checkRange({ target }) {
    const navTitle = this.datepick.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);

    // Отображение дат в полях

    if (this.isTwoInputs) {
      if (this.dp.rangeDateFrom) {
        this.firstItem.value = Datepicker.formatDate({
          firstDate: this.dp.rangeDateFrom,
          mod: 'twoInputMod',
        });
      }

      if (this.dp.rangeDateTo) {
        this.secondItem.value = Datepicker.formatDate({
          firstDate: this.dp.rangeDateTo,
          mod: 'twoInputMod',
        });
      }
    }

    const isSelDate = Datepicker.isSelectedDates({
      isSingleInput: this.isSingleInput,
      rangeDateFrom: this.dp.rangeDateFrom,
      rangeDateTo: this.dp.rangeDateTo,

    });

    if (isSelDate) {
      this.singleItem.value = Datepicker.formatDate({
        firstDate: this.dp.rangeDateFrom,
        secondDate: this.dp.rangeDateTo,
        mod: 'singleInputMod',
      });
    }

    // Удаление старых линий диапазона при выборе нового
    this.#clearRange('start-range');
    this.#clearRange('end-range');

    // Настройка ячеек при смене месяца
    this.#setPointRange();

    if (target.classList.contains('air-datepicker-nav--action')) {
      this.#addPoitRange();
    }

    this.#checkBtnVisibility([this.firstItem, this.secondItem]);
  }

  static isRangeSelecting(point, classRange) {
    return point
      && point.classList.contains('-selected-')
      && !point.classList.contains(classRange);
  }

  static isRangeSelected(point) {
    return point
      && point.classList.contains('end-range')
      && point.classList.contains('start-range');
  }

  static deletePoitRange(point) {
    if (
      Datepicker.isRangeSelected(point)
    ) {
      point.classList.remove('start-range');
      point.classList.remove('end-range');
    }
  }

  static isNotRange({ target, to, from }) {
    return target.classList.contains(to)
    && !target.classList.contains(from)
    && !target.classList.contains('-selected-');
  }

  // Selecting tha range while mousemoving
  #setRange({ target, relatedTarget }) {
    this.#setPointRange();
    let prevDay;

    this.#addPoitRange();

    if (this.rangeFrom && this.rangeFrom.classList.contains('end-range')) {
      this.rangeFrom.classList.remove('end-range');
    }
    if (relatedTarget && !relatedTarget.classList.contains('-days-')) {
      prevDay = relatedTarget;
    }

    // Add rangre while moving
    const isRangeStart = Datepicker.isNotRange({
      target,
      to: '-range-to-',
      from: '-range-from-',
    });

    if (isRangeStart) {
      target.classList.add('end-range');
      if (prevDay) prevDay.classList.remove('end-range');
    }

    const isRangeEnd = Datepicker.isNotRange({
      target,
      to: '-range-from-',
      from: '-range-to-',
    });

    if (isRangeEnd) {
      target.classList.add('start-range');
      if (prevDay) prevDay.classList.remove('start-range');
    }

    // Delete if move fast or leave the container
    this.#clearRange('start-range');
    this.#clearRange('end-range');

    // Delete if mouse return selected date
    if (
      this.#isSameDateHover()
    ) {
      this.#removeRange();
    }
  }

  // End methods of range

  // Date selection methods
  addDateCal(items) {
    if (this.isTwoInputs) {
      const arrItems = Array.from(items, (inputElement) => inputElement.value);
      const isCorrectDateFormat = arrItems.map((e) => e.split('.').reverse().join('.').replaceAll('.', '-'));
      this.dp.selectDate(isCorrectDateFormat);
    }

    if (this.isSingleInput) {
      const dates = this.singleItem.value.split(' - ');
      const [firstValue, secondValue] = dates;

      const firstDate = Datepicker.recreateDate(firstValue);
      const secondDate = Datepicker.recreateDate(secondValue);

      this.dp.selectDate([firstDate, secondDate]);
    }
  }

  static recreateDate(invalidDate) {
    // eslint-disable-next-line prefer-const
    let [day, month] = invalidDate.split(' ');
    month = month.charAt(0).toUpperCase() + month.slice(1);
    month = MONTS.indexOf(month);

    const date = new Date(2022, month, day);
    return date;
  }

  #inputDate() {
    const isCorrectDateFormat = Datepicker.isCorrectDateFormat([...this.items]);

    if (isCorrectDateFormat) {
      this.addDateCal(this.items);

      this.#setPointRange();

      if (this.firstItem.value === this.secondItem.value) {
        Datepicker.changeSameData(this.secondItem);
        this.addDateCal(this.items);
        this.#setPointRange();
        this.#performRange(this.rangeFrom, this.rangeTo);
      }
      if (this.firstItem.value > this.secondItem.value) {
        this.swapDates();
        this.#performRange(this.rangeFrom, this.rangeTo);
        this.addDateCal(this.items);
      }
      if (this.firstItem.value !== this.secondItem.value) {
        this.#performRange(this.rangeFrom, this.rangeTo);
      }
    }
  }

  static formatDate({ firstDate, secondDate = '', mod = 'twoInputMod' }) {
    let result;
    if (secondDate !== '' && mod === 'singleInputMod') {
      const firstDay = firstDate.getDate();
      const secondDay = secondDate.getDate();
      const fistMonth = firstDate
        .toLocaleString('default', { month: 'long' })
        .substring(0, 3);
      const secondMonth = secondDate
        .toLocaleString('default', { month: 'long' })
        .substring(0, 3);

      result = `${firstDay} ${fistMonth} - ${secondDay} ${secondMonth}`;
    }
    if (secondDate === '' && mod === 'twoInputMod') {
      const day = `${firstDate.getDate()}`.length < 2
        ? `0${firstDate.getDate()}`
        : firstDate.getDate();
      const month = `${firstDate.getMonth()}`.length < 2
        ? `0${firstDate.getMonth() + 1}`
        : firstDate.getMonth() + 1;
      const year = firstDate.getFullYear();
      result = `${day}.${month}.${year}`;
    }
    return result;
  }

  static changeSameData(secondItem) {
    const date = secondItem.value.split('.');
    let day = date[0];
    day += 1;
    date.splice(0, 1, day);
    // eslint-disable-next-line no-param-reassign
    secondItem.value = date.join('.');
  }

  // End the date selection methods

  static deleteComma(elem) {
    let text = elem.innerText;
    text = text.replace(',', '').replace('\n', ' ');
    return text;
  }

  #addButtonsArrow() {
    const navButtons = this.datepick.querySelectorAll(
      '.air-datepicker-nav--action',
    );
    navButtons.forEach((e) => {
      e.classList.add('icon__arrow_forward');
    });
  }

  #formatTitle() {
    const navTitle = this.datepick.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);
  }

  static isOneInputClicked({ targetContainer, sibling, container }) {
    return !targetContainer.classList.contains(CLICKED)
      && sibling.classList.contains(CLICKED)
      && container.classList.contains(ACTIVE);
  }

  static isAllInputClicked({ targetContainer, sibling, container }) {
    return targetContainer.classList.contains(CLICKED)
    && sibling.classList.contains(CLICKED)
    && container.classList.contains(ACTIVE);
  }

  static returnInputSibling(targetContainer, formGroups) {
    const sibling = [
      ...formGroups.filter((e) => e !== targetContainer),
    ][0];

    return sibling;
  }

  static #closeDpOnInpitCLick(targetContainer, sibling, calConteiner) {
    targetContainer.classList.remove(CLICKED);
    sibling.classList.remove(CLICKED);
    calConteiner.classList.remove(ACTIVE);
  }

  static toggleDp(targetContainer, calConteiner) {
    targetContainer.classList.toggle(CLICKED);
    calConteiner.classList.toggle(ACTIVE);
  }

  #clickInputOpen({ target }) {
    const targetContainer = target.closest(`.${GROUP}`);
    if (!targetContainer) return;

    if (this.isTwoInputs) {
      const sibling = Datepicker.returnInputSibling(targetContainer, this.formGroups);

      // Click on sthe ibling
      const oneInpClick = Datepicker.isOneInputClicked({
        targetContainer,
        sibling,
        container: this.calConteiner,
      });

      if (oneInpClick) {
        targetContainer.classList.toggle(CLICKED);
        return;
      }

      // Close the calendar and remove all clicked fro the inputs
      const allClicked = Datepicker.isAllInputClicked({
        targetContainer,
        sibling,
        container: this.calConteiner,
      });

      if (allClicked) {
        Datepicker.#closeDpOnInpitCLick(targetContainer, sibling, this.calConteiner);
      }
      Datepicker.toggleDp(targetContainer, this.calConteiner);
    }

    if (this.isSingleInput) {
      Datepicker.toggleDp(targetContainer, this.calConteiner);
    }
  }

  static resetValue(input) {
    // eslint-disable-next-line no-param-reassign
    input.value = '';
  }

  #clear(e) {
    e.preventDefault();
    if (this.isTwoInputs) {
      Datepicker.resetValue(this.firstItem);
      Datepicker.resetValue(this.secondItem);
    }

    if (this.isSingleInput) {
      Datepicker.resetValue(this.singleItem);
    }
    this.dp.clear();
  }

  #closeDp() {
    if (this.calConteiner.classList.contains('datepick__container_only-cal')) return;
    this.calConteiner.classList.remove(ACTIVE);
  }

  #accept(e) {
    e.preventDefault();

    if (this.dp.rangeDateFrom || this.dp.rangeDateTo) {
      this.#closeDp();
    }
  }

  swapDates() {
    [this.firstItem.value, this.econdItem.value] = [
      this.secondItem.value,
      this.firstItem.value,
    ];
  }

  static isSelectedDates({ isSingleInput, rangeDateFrom, rangeDateTo }) {
    return isSingleInput && rangeDateFrom && rangeDateTo;
  }

  setPrev() {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    const tommorow = new Date(year, month, day + 1);
    const fourAfer = new Date(year, month, day + 5);

    if (this.isTwoInputs) {
      this.firstItem.value = Datepicker.formatDate({
        firstDate: tommorow,
        mod: 'twoInputMod',
      });
      this.secondItem.value = Datepicker.formatDate({
        firstDate: fourAfer,
        mod: 'twoInputMod',
      });
      this.addDateCal(this.items);
      this.#setPointRange();
    }

    if (this.isSingleInput) {
      this.singleItem.value = Datepicker.formatDate({
        firstDate: tommorow,
        secondDate: fourAfer,
        mod: 'singleInputMod',
      });
      this.addDateCal(this.items);
      this.#setPointRange();
    }

    this.#performRange(this.rangeFrom, this.rangeTo);
  }

  static isCorrectDateFormat(items) {
    return items.every(({ value, pattern }) => value.match(pattern));
  }
}

export default Datepicker;
