import AirDatepicker from 'air-datepicker';
import { v4 as uuidv4 } from 'uuid';

import {
  MONTHS,
  ITEM,
  DATEPICKER_2,
  DATEPICKER_1,
  START,
  END,
  ACCEPT,
  CLEAR,
  GROUP,
  CONTAINER,
  DATES,
  DATEPICKER,
  ACTIVE,
  CLICKED,
  LABEL,
} from './constants';

class Datepicker {
  constructor(element) {
    this.datepicker = element;
    this.init();
  }

  init() {
    this.#findElements(this.datepicker);
    this.#createId();
    this.#createDatepicker();
    this.#addButtonsArrow();
    this.#checkBtnVisibility([...this.items]);
    this.#addListeners();
  }

  #findElements(container) {
    this.items = container.querySelectorAll(`.${ITEM}`);
    this.formGroups = Array.from(
      container.querySelectorAll(`.${GROUP}`),
    );
    this.buttonClear = container.querySelector(`.${CLEAR}`);
    this.buttonAccept = container.querySelector(`.${ACCEPT}`);

    this.isSingleInput = false;
    this.isTwoInputs = false;
    if (container.classList.contains(DATEPICKER_1)) this.isSingleInput = true;
    if (container.classList.contains(DATEPICKER_2)) this.isTwoInputs = true;
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
    const currentDate = new Date();
    this.calContainer = this.datepicker.querySelector(`.${CONTAINER}`);
    this.dp = new AirDatepicker(this.calContainer, {
      range: true,
      minDate: currentDate,
    });
    this.dp.show();

    if (this.isTwoInputs) {
      this.firstItem = this.datepicker.querySelector(`.${START}`);
      this.secondItem = this.datepicker.querySelector(`.${END}`);
    }

    if (this.isSingleInput) {
      this.singleItem = this.datepicker.querySelector(`.${DATES}`);
    }

    this.#formatTitle();
    if (Datepicker.getUrlParams()) {
      this.#getUrlValues();
    } else {
      this.#setPrev();
    }

    this.#markOlderDays();
  }

  #addListeners() {
    this.datepicker.addEventListener('click', this.#handleDatepickerClick.bind(this));
    this.buttonClear.addEventListener('click', this.#handleButtonClearClick.bind(this));
    this.buttonAccept.addEventListener('click', this.#handleButtonAcceptClick.bind(this));
    this.items.forEach((item) => {
      item.addEventListener('input', this.#handleItemInput.bind(this));
    });
    this.calContainer.addEventListener('click', this.#handleContainerClick.bind(this));
    this.datepicker.addEventListener('mousemove', this.#handleDatepickerMouseMove.bind(this));
    document.addEventListener('click', this.#handleDocumentClick.bind(this));

    this.items.forEach((item) => item.addEventListener('keydown', this.#handleItemKeyDown.bind(this)));
  }

  #handleDatepickerClick(e) {
    this.#clickInputOpen(e);
    this.#markOlderDays();
  }

  #handleButtonClearClick(e) {
    this.#clear(e);
  }

  #handleButtonAcceptClick(e) {
    this.#accept(e);
  }

  #handleDocumentClick({ target }) {
    if (target.closest(`.${DATEPICKER}`) || target.closest('.-other-month-')) return;
    this.datepicker.querySelectorAll(`.${GROUP}`).forEach((e) => {
      if (e.classList.contains(CLICKED)) e.classList.remove(CLICKED);
      if (this.calContainer.classList.contains(ACTIVE)) {
        this.#closeDp();
      }
    });
  }

  #handleItemKeyDown(e) {
    const { code } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.#clickInputOpen(e);
    }
  }

  #getUrlValues() {
    if (this.isSingleInput) {
      const [startUrlDateString, endUrlDateString] = Datepicker.getUrlParams();

      if ((startUrlDateString, endUrlDateString)) {
        const [firstDay, firstMonth, firstYear] = startUrlDateString.split('.');
        const [secondDay, secondMonth, secondYear] = endUrlDateString.split('.');

        const startDate = new Date(firstYear, firstMonth - 1, firstDay);
        const endDate = new Date(secondYear, secondMonth - 1, secondDay);

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

  #markOlderDays() {
    const allDays = this.calContainer.querySelectorAll('.-day-');
    allDays.forEach((e) => {
      if (Datepicker.isItemDateLessThanNow(e)) {
        e.classList.add('old-date');
      }
    });
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

  #performRange(rangeFrom, rangeTo) {
    this.#clearRange('start-range');
    this.#clearRange('end-range');
    Datepicker.deletePointRange(rangeFrom);
    Datepicker.deletePointRange(rangeTo);
    this.#addPointRange(rangeFrom, rangeTo);
  }

  #clearRange(rangeLineClass) {
    const elements = [...this.datepicker.querySelectorAll(`.${rangeLineClass}`)];
    if (elements.length === 0) return;
    elements.forEach((el) => {
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
    this.rangeFrom = this.datepicker.querySelector('.-range-from-');
    this.rangeTo = this.datepicker.querySelector('.-range-to-');
  }

  #addPointRange() {
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

  #handleContainerClick({ target }) {
    if (target.classList.contains('old-date') || target.classList.contains('-days-')) return;
    const navTitle = this.datepicker.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);

    const date = new Date(this.dp.rangeDateFrom);
    const isLessThanNow = Datepicker.isDateBiggerThanNow({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    });

    if (this.isTwoInputs) {
      if (this.dp.rangeDateFrom) {
        const currentDate = new Date();
        const firstDate = isLessThanNow ? currentDate : this.dp.rangeDateFrom;
        this.firstItem.value = Datepicker.formatDate({
          firstDate,
          mod: 'twoInputMod',
        });
      }

      if (this.dp.rangeDateTo) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const firstDate = isLessThanNow ? tomorrow : this.dp.rangeDateTo;
        this.secondItem.value = Datepicker.formatDate({
          firstDate,
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

    // Delete old lines with selecting a new line
    this.#clearRange('start-range');
    this.#clearRange('end-range');

    // Change the cells when the month changed
    this.#setPointRange();

    if (target.classList.contains('air-datepicker-nav--action')) {
      this.#addPointRange();
    }

    this.#checkBtnVisibility([this.firstItem, this.secondItem]);
  }

  #handleDatepickerMouseMove({ target, relatedTarget }) {
    if (target.classList.contains('old-date')) return;

    this.#setPointRange();
    let prevDay;

    this.#addPointRange();

    if (this.rangeFrom && this.rangeFrom.classList.contains('end-range')) {
      this.rangeFrom.classList.remove('end-range');
    }
    if (relatedTarget && !relatedTarget.classList.contains('-days-')) {
      prevDay = relatedTarget;
    }

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

  #addDateCal(items) {
    if (this.isTwoInputs) {
      const arrItems = Array.from(items, (inputElement) => inputElement.value);
      const correctDate = arrItems.map((e) => {
        const [day, month, year] = e.split('.');
        const formattedMonth = Number(month) - 1;

        if (Datepicker.isDateBiggerThanNow({ year, month: formattedMonth, day })) {
          const { currentDay, currentMonth, currentYear } = Datepicker.getCurrentDate();
          return `${currentYear}-${currentMonth + 1}-${currentDay}`;
        }
        return `${year}-${month}-${day}`;
      });

      const correctInputValue = correctDate.map((e) => e.split('-').reverse().join('.'));

      const [firstValue, secondValue] = correctInputValue;
      this.firstItem.value = firstValue;
      this.secondItem.value = secondValue;

      this.dp.selectDate(correctDate);
    }

    if (this.isSingleInput) {
      const dates = this.singleItem.value.split(' - ');
      const [firstValue, secondValue] = dates;

      const firstDate = Datepicker.recreateDate(firstValue);
      const secondDate = Datepicker.recreateDate(secondValue);

      this.dp.selectDate([firstDate, secondDate]);
    }
  }

  #handleItemInput() {
    const correctDateFormat = Datepicker.correctDateFormat([...this.items]);

    if (correctDateFormat) {
      this.#addDateCal(this.items);

      if (this.firstItem.value === this.secondItem.value) {
        Datepicker.changeSameData(this.secondItem);
        this.#addDateCal(this.items);
      }
      if (this.firstItem.value > this.secondItem.value) {
        this.#swapDates();
        this.#addDateCal(this.items);
      }

      this.#setPointRange();
      this.#performRange(this.rangeFrom, this.rangeTo);
    }
  }

  #addButtonsArrow() {
    const navButtons = this.datepicker.querySelectorAll(
      '.air-datepicker-nav--action',
    );
    navButtons.forEach((e) => {
      e.classList.add('icon__arrow_forward');
    });
  }

  #formatTitle() {
    const navTitle = this.datepicker.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);
  }

  #clickInputOpen({ target }) {
    const targetContainer = target.closest(`.${GROUP}`);
    if (!targetContainer) return;

    if (this.isTwoInputs) {
      const sibling = Datepicker.returnInputSibling(targetContainer, this.formGroups);

      // Click on the sibling
      const oneInpClick = Datepicker.isOneInputClicked({
        targetContainer,
        sibling,
        container: this.calContainer,
      });

      if (oneInpClick) {
        targetContainer.classList.toggle(CLICKED);
        return;
      }

      // Close the calendar and remove all clicked fro the inputs
      const allClicked = Datepicker.isAllInputClicked({
        targetContainer,
        sibling,
        container: this.calContainer,
      });

      if (allClicked) {
        Datepicker.#closeDpOnInputCLick(targetContainer, sibling, this.calContainer);
      }
      Datepicker.toggleDp(targetContainer, this.calContainer);
    }

    if (this.isSingleInput) {
      Datepicker.toggleDp(targetContainer, this.calContainer);
    }
  }

  #swapDates() {
    [this.firstItem.value, this.secondItem.value] = [
      this.secondItem.value,
      this.firstItem.value,
    ];
  }

  #setPrev() {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    const tomorrow = new Date(year, month, day + 1);
    const fourAfter = new Date(year, month, day + 5);

    if (this.isTwoInputs) {
      this.firstItem.value = Datepicker.formatDate({
        firstDate: tomorrow,
        mod: 'twoInputMod',
      });
      this.secondItem.value = Datepicker.formatDate({
        firstDate: fourAfter,
        mod: 'twoInputMod',
      });
      this.#addDateCal(this.items);
      this.#setPointRange();
    }

    if (this.isSingleInput) {
      this.singleItem.value = Datepicker.formatDate({
        firstDate: tomorrow,
        secondDate: fourAfter,
        mod: 'singleInputMod',
      });
      this.#addDateCal(this.items);
      this.#setPointRange();
    }

    this.#performRange(this.rangeFrom, this.rangeTo);
  }

  #closeDp() {
    if (this.calContainer.classList.contains('datepicker__container_only-cal')) return;
    this.calContainer.classList.remove(ACTIVE);
  }

  #accept(e) {
    e.preventDefault();

    if (this.dp.rangeDateFrom || this.dp.rangeDateTo) {
      this.#closeDp();
    }
  }

  #clear(e) {
    e.preventDefault();
    if (this.isTwoInputs) {
      this.firstItem.value = '';
      this.secondItem.value = '';
    }

    if (this.isSingleInput) {
      this.singleItem.value = '';
    }
    this.dp.clear();
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

  static #closeDpOnInputCLick(targetContainer, sibling, calContainer) {
    targetContainer.classList.remove(CLICKED);
    sibling.classList.remove(CLICKED);
    calContainer.classList.remove(ACTIVE);
  }

  static toggleDp(targetContainer, calContainer) {
    targetContainer.classList.toggle(CLICKED);
    calContainer.classList.toggle(ACTIVE);
  }

  static isSelectedDates({ isSingleInput, rangeDateFrom, rangeDateTo }) {
    return isSingleInput && rangeDateFrom && rangeDateTo;
  }

  static correctDateFormat(items) {
    return items.every(({ value, pattern }) => value.match(pattern));
  }

  static getUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const startUrlDateString = urlParams.get('datepicker-input-start');
    const endUrlDateString = urlParams.get('datepicker-input-end');

    if ((startUrlDateString, endUrlDateString)) {
      return [startUrlDateString, endUrlDateString];
    }
    return false;
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
      const month = `${firstDate.getMonth()}`.length < 2 && firstDate.getMonth() !== 9
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

  static deleteComma(elem) {
    let text = elem.innerText;
    text = text.replace(',', '').replace('\n', ' ');
    return text;
  }

  static recreateDate(invalidDate) {
    const [day, month] = invalidDate.split(' ');
    let formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    formattedMonth = MONTHS.indexOf(month);
    const date = new Date(2022, formattedMonth, day);
    return date;
  }

  static isNotRange({ target, to, from }) {
    return target.classList.contains(to)
    && !target.classList.contains(from)
    && !target.classList.contains('-selected-');
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

  static deletePointRange(point) {
    if (
      Datepicker.isRangeSelected(point)
    ) {
      point.classList.remove('start-range');
      point.classList.remove('end-range');
    }
  }

  static isItemDateLessThanNow(target) {
    const day = Number(target.dataset.date) < 10 ? `0${target.dataset.date}` : target.dataset.date;
    const { month, year } = target.dataset;
    const result = Datepicker.isDateBiggerThanNow({ year, month, day });
    return result;
  }

  static isDateBiggerThanNow({ year, month, day }) {
    const { currentYear, currentMonth, currentDay } = Datepicker.getCurrentDate();
    const fullCurrentDate = new Date(`${currentMonth}-${currentDay}-${currentYear}`);
    const date1 = new Date(`${month}-${day}-${year}`);
    const date2 = new Date(fullCurrentDate);

    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays > 0) {
      return true;
    }
    return false;
  }

  static getCurrentDate() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return { currentDay, currentMonth, currentYear };
  }
}

export default Datepicker;
