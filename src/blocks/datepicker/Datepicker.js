import AirDatepicker from 'air-datepicker';
import { v4 as uuidv4 } from 'uuid';
import Inputmask from 'inputmask';

import {
  MONTHS,
  FIELD,
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
  ICON,
  ICON_ACTIVE,
  NAV_ARROW,
} from './constants';

class Datepicker {
  constructor(element) {
    this.datepicker = element;
    this.init();
  }

  init() {
    this.#createDatepicker();
    this.#addButtonsArrow();
    this.#findElements();
    this.#createID();
    this.#configuratorDatepicker();
    this.#checkBtnVisibility([...this.fields]);
    this.#addListeners();
    this.#addTabIndex();
    this.#addMask();
  }

  #findElements() {
    this.fields = this.datepicker.querySelectorAll(`.${FIELD}`);
    this.formGroups = Array.from(
      this.datepicker.querySelectorAll(`.${GROUP}`),
    );
    this.buttonClear = this.datepicker.querySelector(`.${CLEAR}`);
    this.buttonAccept = this.datepicker.querySelector(`.${ACCEPT}`);
    this.icons = this.datepicker.querySelectorAll(`.${ICON}`);
    this.navButtons = this.datepicker.querySelectorAll('.air-datepicker-nav--action');
    this.datepickerBody = this.datepicker.querySelector('.air-datepicker-body');

    this.isSingleInput = false;
    this.isTwoInputs = false;
    if (this.datepicker.classList.contains(DATEPICKER_1)) this.isSingleInput = true;
    if (this.datepicker.classList.contains(DATEPICKER_2)) this.isTwoInputs = true;
    this.rangeFrom = null;
    this.rangeTo = null;
    this.relatedTarget = null;

    this.lastDay = this.datepicker.querySelector('.air-datepicker-body--cells').lastElementChild;
  }

  #addListeners() {
    this.datepicker.addEventListener('click', this.#handleDatepickerClick.bind(this));
    this.buttonClear.addEventListener('click', this.#handleButtonClearClick.bind(this));
    this.buttonAccept.addEventListener('click', this.#handleButtonAcceptClick.bind(this));
    this.fields.forEach((item) => {
      item.addEventListener('input', this.#handleItemInput.bind(this));
    });
    this.datepickerBody.addEventListener('click', this.#handleBodyClick.bind(this));
    this.datepickerBody.addEventListener('keydown', this.#handleBodyKeyPress.bind(this));

    document.addEventListener('click', this.#handleDocumentClick.bind(this));

    this.fields.forEach((field) => field.addEventListener('keydown', this.#handleFieldKeyDown.bind(this)));
    this.navButtons.forEach((item) => item.addEventListener('keydown', this.#handleNavKeyPress.bind(this)));

    this.lastDay.addEventListener('blur', this.#handleFocusAccept.bind(this));
  }

  #handleFocusAccept() {
    this.buttonAccept.querySelector('button').focus();
    this.buttonAccept.querySelector('button').tabIndex = '0';
  }

  #handleNavKeyPress(e) {
    const { code } = e;
    const action = e.target.dataset.action === 'prev' ? 'prevNavButton' : 'nextNavButton';
    if (code === 'Enter' || code === 'Space') {
      e.preventDefault();
      if (action === 'nextNavButton') this.dp.next();
      if (action === 'prevNavButton') this.dp.prev();

      this.#addTabIndex();
    }
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
        this.icons.forEach((icon) => icon.classList.toggle(ICON_ACTIVE));
      }
    });
  }

  #handleFieldKeyDown(e) {
    const { code } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.#clickInputOpen(e);
    }
  }

  #handleBodyKeyPress(e) {
    const { code, target } = e;
    if (code === 'Enter' || code === 'Space') {
      e.preventDefault();
      this.relatedTarget = target;
      if (this.rangeFrom) {
        target.classList.add('.-range-to-');
      } else {
        this.#deleteRangePoint('-range-from-');
        this.#deleteRangePoint('-range-to-');
        target.classList.add('-range-from-');
      }

      const { year, month, date } = target.dataset;
      const dateTarget = new Date(year, month, date);
      this.dp.selectDate(dateTarget);
      this.#handleContainerClick(e);
      this.datepickerBody.querySelectorAll('.-day-').forEach((day) => {
        day.addEventListener('focus', this.#handleBodyFocus.bind(this));
      });
      this.#performRange();
      if (target.classList.contains('-other-month-')) this.#addTabIndex();
    }

    if (code === 'Tab' && !this.isFirstPressOnDay) {
      this.relatedTarget = target;
    }
  }

  #handleContainerClick({ target }) {
    if (target.classList.contains('old-date') || target.classList.contains('-days-')) return;
    this.#formatTitle();

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

    this.#deleteRangePoint('start-range');
    this.#deleteRangePoint('end-range');
    this.#setPointRange();

    if (target.classList.contains('air-datepicker-nav--action')) {
      this.#addPointRange();
    }

    this.#checkBtnVisibility([this.firstItem, this.secondItem]);
  }

  #handleBodyFocus({ target }) {
    this.#performSelectingRange(target, this.relatedTarget);
  }

  #handleBodyClick(e) {
    this.datepicker.addEventListener('mousemove', this.#handleDatepickerMouseMove.bind(this));
    this.#handleContainerClick(e);
  }

  #handleDatepickerMouseMove({ target, relatedTarget }) {
    this.#performSelectingRange(target, relatedTarget);
  }

  #addMask() {
    this.fields.forEach((e) => {
      if (this.isTwoInputs) {
        Inputmask('datetime', {
          alias: 'datetime',
          inputFormat: 'dd.mm.yyyy',
          placeholder: '__.__.____',
          showMaskOnHover: false,
          showMaskOnFocus: false,
          greedy: false,
        }).mask(e);
      }
    });
  }

  #performSelectingRange(target, relatedTarget) {
    if (target === relatedTarget) return;
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

    this.#deleteRangePoint('start-range');
    this.#deleteRangePoint('end-range');

    if (
      this.#isSameDateHover()
    ) {
      this.#removeRange();
    }
  }

  #handleItemInput() {
    const correctDateFormat = Datepicker.correctDateFormat([...this.fields]);

    if (correctDateFormat) {
      if (this.firstItem.value === this.secondItem.value) {
        this.secondItem.value = Datepicker.changeSameData(this.secondItem);
      }
      if (this.firstItem.value > this.secondItem.value) {
        this.#swapDates();
      }

      this.#addDateCal();
      this.#removeRange();
      this.#setPointRange();
      this.#performRange();
    }
  }

  #createID() {
    this.formGroups.forEach((e) => {
      const label = e.querySelector(`.${LABEL}`);
      const input = e.querySelector(`.${FIELD}`);
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
      keyboardNav: true,
      prevHtml: NAV_ARROW,
      nextHtml: NAV_ARROW,
    });
    this.dp.show();
  }

  #configuratorDatepicker() {
    if (this.isTwoInputs) {
      this.firstItem = this.datepicker.querySelector(`.${START}`);
      this.secondItem = this.datepicker.querySelector(`.${END}`);
    }

    if (this.isSingleInput) {
      this.singleItem = this.datepicker.querySelector(`.${DATES}`);
    }

    this.#formatTitle();
    if (Datepicker.getURLParams()) {
      this.#getURLValues();
    } else {
      this.#setPrev();
    }

    this.#markOlderDays();
  }

  #markOlderDays() {
    const allDays = this.calContainer.querySelectorAll('.-day-');
    allDays.forEach((e) => {
      if (Datepicker.isItemDateLessThanNow(e)) {
        e.classList.add('old-date');
      }
    });
  }

  #addTabIndex() {
    const allDays = this.calContainer.querySelectorAll('.-day-');
    allDays.forEach((e) => {
      if (!Datepicker.isItemDateLessThanNow(e)) {
        e.tabIndex = '0';
      }
    });

    const navButtons = this.calContainer.querySelectorAll('.air-datepicker-nav--action');
    navButtons.forEach((e) => {
      e.tabIndex = '0';
    });

    this.buttonAccept.querySelector('button').tabIndex = '-1';
  }

  #addButtonsArrow() {
    const navButtons = this.datepicker.querySelectorAll(
      '.air-datepicker-nav--action',
    );
    navButtons.forEach((e) => {
      e.classList.add('datepicker__icon_forward');
    });
  }

  #formatTitle() {
    const navTitle = this.datepicker.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);
  }

  #getURLValues() {
    if (this.isSingleInput) {
      const [startURLDateString, endURLDateString] = Datepicker.getURLParams();

      if ((startURLDateString, endURLDateString)) {
        const [firstDay, firstMonth, firstYear] = startURLDateString.split('.');
        const [secondDay, secondMonth, secondYear] = endURLDateString.split('.');

        const startDate = new Date(firstYear, firstMonth - 1, firstDay);
        const endDate = new Date(secondYear, secondMonth - 1, secondDay);

        this.dp.selectDate([startDate, endDate]);
        this.singleItem.value = Datepicker.formatDate({
          firstDate: startDate,
          secondDate: endDate,
          mod: 'singleInputMod',
        });
        this.#setPointRange();
        this.#performRange();
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

  #performRange() {
    this.#deleteRangePoint('start-range');
    this.#deleteRangePoint('end-range');
    Datepicker.deletePointRange(this.rangeFrom);
    Datepicker.deletePointRange(this.rangeTo);
    this.#addPointRange(this.rangeFrom, this.rangeTo);
  }

  #deleteRangePoint(rangeLineClass) {
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
      if (this.rangeFrom.classList.contains('end-range')) {
        this.rangeFrom.classList.remove('end-range');
      }
    }

    if (
      Datepicker.isRangeSelecting(this.rangeTo, 'end-range')
    ) {
      this.rangeTo.classList.add('end-range');
      if (this.rangeTo.classList.contains('start-range')) {
        this.rangeTo.classList.remove('start-range');
      }
    }
  }

  #isSameDateHover() {
    return this.rangeFrom
      && this.rangeFrom.classList.contains('-focus-')
      && this.rangeFrom.classList.contains('-range-to-')
      && this.rangeFrom.classList.contains('-range-from-')
      && this.rangeFrom.classList.contains('-selected-');
  }

  #addDateCal() {
    if (this.isTwoInputs) {
      const arrItems = Array.from(this.fields, (inputElement) => inputElement.value);
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
      this.#performRange();
    }

    if (this.isSingleInput) {
      const dates = this.singleItem.value.split(' - ');
      const [firstValue, secondValue] = dates;

      const firstDate = Datepicker.recreateDate(firstValue);
      const secondDate = Datepicker.recreateDate(secondValue);

      this.dp.selectDate([firstDate, secondDate]);
    }
  }

  #clickInputOpen({ target }) {
    this.#formatTitle();
    const targetContainer = target.closest(`.${GROUP}`);
    if (!targetContainer) return;

    if (this.isTwoInputs) {
      const sibling = Datepicker.returnInputSibling(targetContainer, this.formGroups);

      const oneInpClick = Datepicker.isOneInputClicked({
        targetContainer,
        sibling,
        container: this.calContainer,
      });

      if (oneInpClick) {
        targetContainer.classList.toggle(CLICKED);
        return;
      }

      const allClicked = Datepicker.isAllInputClicked({
        targetContainer,
        sibling,
        container: this.calContainer,
      });

      this.#toggleDp(targetContainer, this.calContainer);

      if (allClicked) {
        Datepicker.closeDpOnInputCLick(targetContainer, sibling, this.calContainer);
      }
    }

    if (this.isSingleInput) {
      this.#toggleDp(targetContainer, this.calContainer);
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
    const fourAfter = Datepicker.getFourAfter();

    if (this.isTwoInputs) {
      this.firstItem.value = Datepicker.formatDate({
        firstDate: tomorrow,
        mod: 'twoInputMod',
      });
      this.secondItem.value = Datepicker.formatDate({
        firstDate: fourAfter,
        mod: 'twoInputMod',
      });
    }

    if (this.isSingleInput) {
      this.singleItem.value = Datepicker.formatDate({
        firstDate: tomorrow,
        secondDate: fourAfter,
        mod: 'singleInputMod',
      });
    }

    this.#addDateCal();
    this.#setPointRange();
    this.#performRange();
  }

  #closeDp() {
    if (this.calContainer.classList.contains('datepicker__container_only-cal')) return;
    this.calContainer.classList.remove(ACTIVE);
    this.#checkDateAfterClosing();
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
    this.#deleteRangePoint('start-range');
    this.#deleteRangePoint('end-range');
    this.#checkBtnVisibility([...this.fields]);
  }

  #toggleDp(targetContainer, calContainer) {
    targetContainer.classList.toggle(CLICKED);
    calContainer.classList.toggle(ACTIVE);
    this.icons.forEach((icon) => icon.classList.toggle(ICON_ACTIVE));
  }

  #checkDateAfterClosing() {
    if (this.isTwoInputs) {
      this.secondItem.value = Datepicker.formatDate({
        firstDate: this.dp.rangeDateTo,
        mod: 'twoInputMod',
      });
    }

    if (this.isSingleInput) {
      if (!this.dp.rangeDateFrom && !this.dp.rangeDateTo) return;
      this.singleItem.value = Datepicker.formatDate({
        firstDate: this.dp.rangeDateFrom,
        secondDate: this.dp.rangeDateTo,
        mod: 'singleInputMod',
      });
    }

    this.#performRange();
    this.#setPointRange();
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
    const sibling = formGroups.find((e) => e !== targetContainer);
    return sibling;
  }

  static closeDpOnInputCLick(targetContainer, sibling, calContainer) {
    targetContainer.classList.remove(CLICKED);
    sibling.classList.remove(CLICKED);
    calContainer.classList.remove(ACTIVE);
  }

  static isSelectedDates({ isSingleInput, rangeDateFrom, rangeDateTo }) {
    return isSingleInput && rangeDateFrom && rangeDateTo;
  }

  static correctDateFormat(items) {
    return items.every(({ value, pattern }) => value.match(pattern));
  }

  static getURLParams() {
    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);

    const startURLDateString = URLParams.get('datepicker-input-start');
    const endURLDateString = URLParams.get('datepicker-input-end');

    if ((startURLDateString, endURLDateString)) {
      return [startURLDateString, endURLDateString];
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
    let date = secondItem.value.split('.');
    let [day] = date;
    day = Number(day) + 1;
    date = [day, date.slice(1, 3)].flat().join('.');
    return date;
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

  static getFourAfter() {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();
    const fourAfter = new Date(year, month, day + 5);

    return fourAfter;
  }
}

export default Datepicker;
