import AirDatepicker from 'air-datepicker';
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
} from './constants';

class Datepicker {
  constructor(element) {
    this.datepick = element;
    this.init();
  }

  init() {
    this.findElems(this.datepick);
    this.createDatepicker();
    this.addButtonsArrow();
    this.checkBtnVisibility([...this.items]);
    this.addListeners();
  }

  findElems(container) {
    this.items = container.querySelectorAll(`.${ITEM}`);
    this.formGroups = Array.from(
      container.querySelectorAll(`.${GROUP}`),
    );
    this.buttonClear = container.querySelector(`.${CLEAR}`);
    this.buttonAccept = container.querySelector(`.${ACCEPT}`);

    if (container.classList.contains(DATEPICK_1)) this.isSingleInput = true;
    if (container.classList.contains(DATEPICK_2)) this.isTwoInputs = true;
    this.rangeFrom = null;
    this.rangeTo = null;
  }

  createDatepicker() {
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

    this.formatTitle();
    if (Datepicker.getUrlParams()) {
      this.getUrlValues();
    } else {
      this.setPrev();
    }
  }

  addListeners() {
    this.datepick.addEventListener('click', this.clickInputOpen.bind(this));
    this.buttonClear.addEventListener('click', this.clear.bind(this));
    this.buttonAccept.addEventListener('click', this.accept.bind(this));
    this.items.forEach((item) => {
      item.addEventListener('input', this.inputDate.bind(this));
    });
    this.calConteiner.addEventListener('click', this.checkRange.bind(this));
    this.datepick.addEventListener('mousemove', this.setRange.bind(this));
    document.addEventListener('click', this.closeOuterClick.bind(this));
  }

  closeOuterClick({ target }) {
    if (target.closest(`.${DATEPICK}`)) return;
    this.datepick.querySelectorAll(`.${GROUP}`).forEach((e) => {
      if (e.classList.contains('clicked')) e.classList.remove('clicked');
      if (this.calConteiner.classList.contains('_active-dp')) {
        this.calConteiner.classList.remove('_active-dp');
      }
    });
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

  getUrlValues() {
    if (this.isSingleInput) {
      const [startUrlDateString, endUrlDateString] = Datepicker.getUrlParams();

      if ((startUrlDateString, endUrlDateString)) {
        const [firstDay, firstmonth, firstyear] = startUrlDateString.split('.');
        const [secondDay, secondmonth, secondyear] = endUrlDateString.split('.');

        const startDate = new Date(firstyear, firstmonth, firstDay);
        const endDate = new Date(secondyear, secondmonth, secondDay);

        this.dp.selectDate([startDate, endDate]);
        this.singleItem.value = Datepicker.formatDate({
          firstDate: startDate,
          secondDate: endDate,
          mod: 'singleInputMod',
        });
        this.setPointRange();
        this.performRange(this.rangeFrom, this.rangeTo);
      }
    }
  }

  checkBtnVisibility(itemsArr) {
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

  // Методы выделения диапазона
  performRange(rangeFrom, rangeTo) {
    Datepicker.clearRange(this.datepick, 'start-range');
    Datepicker.clearRange(this.datepick, 'end-range');
    Datepicker.deletePoitRange(rangeFrom);
    Datepicker.deletePoitRange(rangeTo);
    Datepicker.addPoitRange(rangeFrom, rangeTo);
  }

  static isRangeSelecting(point, classRange) {
    return point
      && point.classList.contains('-selected-')
      && !point.classList.contains(classRange);
  }

  static addPoitRange(startPoint, endPoint) {
    if (this.isRangeSelecting(startPoint, 'start-range')) {
      startPoint.classList.add('start-range');
    }

    if (
      this.isRangeSelecting(endPoint, 'end-range')
    ) {
      endPoint.classList.add('end-range');
    }
  }

  static isRangeSelected(point) {
    return point
      && point.classList.contains('end-range')
      && point.classList.contains('start-range');
  }

  static deletePoitRange(point) {
    if (
      this.isRangeSelected(point)
    ) {
      point.classList.remove('start-range');
      point.classList.remove('end-range');
    }
  }

  static clearRange(container, rangeLineClass) {
    const elems = [...container.querySelectorAll(`.${rangeLineClass}`)];
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

  // Конец методов выделения диапазона
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

  addDateCal(items) {
    if (this.isTwoInputs) {
      const dates = Array.from(
        [...items].map((inputElement) => inputElement.value),
      ).map((e) => e.split('.').reverse().join('.').replaceAll('.', '-'));
      this.dp.selectDate(dates);
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

  static deleteComma(elem) {
    let text = elem.innerText;
    text = text.replace(',', '').replace('\n', ' ');
    return text;
  }

  addButtonsArrow() {
    const navButtons = this.datepick.querySelectorAll(
      '.air-datepicker-nav--action',
    );
    navButtons.forEach((e) => {
      e.classList.add('icon__arrow_forward');
    });
  }

  formatTitle() {
    const navTitle = this.datepick.querySelector('.air-datepicker-nav--title');
    navTitle.innerText = Datepicker.deleteComma(navTitle);
  }

  static isOneInputClicked({ targetContainer, sibling, container }) {
    return !targetContainer.classList.contains('clicked')
      && sibling.classList.contains('clicked')
      && container.classList.contains('_active-dp');
  }

  static isAllInputClicked({ targetContainer, sibling, container }) {
    return targetContainer.classList.contains('clicked')
    && sibling.classList.contains('clicked')
    && container.classList.contains('_active-dp');
  }

  static returnInputSibling(targetContainer, formGroups) {
    const sibling = [
      ...formGroups.filter((e) => e !== targetContainer),
    ][0];

    return sibling;
  }

  static closeDpOnInpitCLick(targetContainer, sibling, calConteiner) {
    targetContainer.classList.remove('clicked');
    sibling.classList.remove('clicked');
    calConteiner.classList.remove('_active-dp');
  }

  static toggleDp(targetContainer, calConteiner) {
    targetContainer.classList.toggle('clicked');
    calConteiner.classList.toggle('_active-dp');
  }

  clickInputOpen({ target }) {
    const targetContainer = target.closest(`.${GROUP}`);
    if (!targetContainer) return;

    if (this.isTwoInputs) {
      const sibling = Datepicker.returnInputSibling(targetContainer, this.formGroups);

      // Клик по сосденему инпуту после клика на первый, календарь не закрывается
      const oneInpClick = Datepicker.isOneInputClicked({
        targetContainer,
        sibling,
        container: this.calConteiner,
      });

      if (oneInpClick) {
        targetContainer.classList.toggle('clicked');
        return;
      }

      // Закрыть календарь и снять все clicked на элементах
      // в случае повторонго клика по любому элементу при открытом календаре
      const allClicked = Datepicker.isAllInputClicked({
        targetContainer,
        sibling,
        container: this.calConteiner,
      });

      if (allClicked) {
        Datepicker.closeDpOnInpitCLick(targetContainer, sibling, this.calConteiner);
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

  clear(e) {
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

  static closeDp(calConteiner) {
    calConteiner.classList.remove('_active-dp');
  }

  accept(e) {
    e.preventDefault();

    if (this.dp.rangeDateFrom || this.dp.rangeDateTo) {
      Datepicker.closeDp(this.calConteiner);
    }
  }

  static correctFormat(items) {
    return items.every(({ value, pattern }) => value.match(pattern));
  }

  static changeSameData(secondItem) {
    const date = secondItem.value.split('.');
    let day = date[0];
    day += 1;
    date.splice(0, 1, day);
    // eslint-disable-next-line no-param-reassign
    secondItem.value = date.join('.');
  }

  swapDates() {
    [this.firstItem.value, this.econdItem.value] = [
      this.secondItem.value,
      this.firstItem.value,
    ];
  }

  inputDate() {
    const correctFormat = Datepicker.correctFormat([...this.items]);

    if (correctFormat) {
      this.addDateCal(this.items);

      this.setPointRange();

      if (this.firstItem.value === this.secondItem.value) {
        Datepicker.changeSameData(this.secondItem);
        this.addDateCal(this.items);
        this.setPointRange();
        this.performRange(this.rangeFrom, this.rangeTo);
      }
      if (this.firstItem.value > this.secondItem.value) {
        this.swapDates();
        this.performRange(this.rangeFrom, this.rangeTo);
        this.addDateCal(this.items);
      }
      if (this.firstItem.value !== this.secondItem.value) {
        this.performRange(this.rangeFrom, this.rangeTo);
      }
    }
  }

  static isSelectedDates({ isSingleInput, rangeDateFrom, rangeDateTo }) {
    return isSingleInput && rangeDateFrom && rangeDateTo;
  }

  static isNotRange({ target, to, from }) {
    return target.classList.contains(to)
    && !target.classList.contains(from)
    && !target.classList.contains('-selected-');
  }

  checkRange({ target }) {
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
    Datepicker.clearRange(this.datepick, 'start-range');
    Datepicker.clearRange(this.datepick, 'end-range');

    // Настройка ячеек при смене месяца
    this.setPointRange();

    if (target.classList.contains('air-datepicker-nav--action')) {
      Datepicker.addPoitRange(this.rangeFrom, this.rangeTo);
    }

    this.checkBtnVisibility([this.firstItem, this.secondItem]);
  }

  static isSameDateHover(rangeFrom) {
    return rangeFrom
      && rangeFrom.classList.contains('-focus-')
      && rangeFrom.classList.contains('-range-to-')
      && rangeFrom.classList.contains('-range-from-')
      && rangeFrom.classList.contains('-selected-');
  }

  // Selecting tha range while mousemoving
  setRange({ target, relatedTarget }) {
    this.setPointRange();

    // Переменная для пред. дня при движении мыши во время выделения диапазона
    let prevDay;

    Datepicker.addPoitRange(this.rangeFrom, this.rangeTo);

    if (this.rangeFrom && this.rangeFrom.classList.contains('end-range')) {
      this.rangeFrom.classList.remove('end-range');
    }

    // Назначить переменной пред. дня значение
    if (relatedTarget && !relatedTarget.classList.contains('-days-')) {
      prevDay = relatedTarget;
    }

    // Добавить выделение диапазона при движении мыши
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

    // Удаление выделения диапазона у элементов там, где это не нужно при быстром
    // движении мыши или выход за контейнер.
    Datepicker.clearRange(this.datepick, 'start-range');
    Datepicker.clearRange(this.datepick, 'end-range');

    // Удалить выделение диапазона в случае возврата мыши к выбранной дате
    if (
      Datepicker.isSameDateHover(this.rangeFrom)
    ) {
      Datepicker.removeRange();
    }
  }

  static removeRange(rangeFrom) {
    rangeFrom.classList.remove('end-range');
    rangeFrom.classList.remove('start-range');
  }

  setPointRange() {
    this.rangeFrom = this.datepick.querySelector('.-range-from-');
    this.rangeTo = this.datepick.querySelector('.-range-to-');
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
      this.setPointRange();
    }

    if (this.isSingleInput) {
      this.singleItem.value = Datepicker.formatDate({
        firstDate: tommorow,
        secondDate: fourAfer,
        mod: 'singleInputMod',
      });
      this.addDateCal(this.items);
      this.setPointRange();
    }

    this.performRange(this.rangeFrom, this.rangeTo);
  }
}

export default Datepicker;
