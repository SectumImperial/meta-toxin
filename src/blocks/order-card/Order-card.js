import { v4 as uuidv4 } from 'uuid';

import {
  DAYS_COMPUTE,
  DAYS_COMPUTED,
  FEE_COMPUTE,
  FEE_COMPUTED,
  ADD_FEE_COMPUTE,
  ADD_FEE_COMPUTED,
  SUM,
  START_DATE,
  END_DATE,
  FEES_DISC,
  ADD_FEE,
  PRICE,
  DEFAULT_DAYS,
} from './constants';

class OrderCard {
  constructor(element) {
    this.card = element;
    this.init();
  }

  init() {
    this.#findElements();
    this.#createVars();
    this.#computeSum();
    this.#createRentString();
    this.#createFeeString();
    this.#createAddFeeString();
    this.#insertFinalSum();
    this.#addListeners();
  }

  #addListeners() {
    this.startDate.addEventListener('input', this.#handleDatepickerInput.bind(this));
    this.endDate.addEventListener('input', this.#handleDatepickerInput.bind(this));
    this.datepicker.addEventListener('click', this.#handleDatepickerClick.bind(this));
    document.addEventListener('click', this.#handleDocumentClick.bind(this));
    document.querySelectorAll('.js-order-card__tip').forEach((e) => {
      e.addEventListener('mouseenter', OrderCard.handleTipMouseEnter.bind(this));
      e.addEventListener('mouseout', OrderCard.handleTipMouseOut.bind(this));
      e.addEventListener('focus', OrderCard.handleTipFocus.bind(this));
      e.addEventListener('blur', OrderCard.handleTipBlur.bind(this));
    });
  }

  #handleDatepickerInput() {
    this.#updateCounting();
  }

  #handleDatepickerClick() {
    this.#updateCounting();
  }

  #handleDocumentClick() {
    this.#updateCounting();
  }

  #findElements() {
    this.startDate = this.card.querySelector(`.${START_DATE}`);
    this.endDate = this.card.querySelector(`.${END_DATE}`);
    this.datepicker = this.card.querySelector('.datepicker__container');
  }

  #updateCounting() {
    this.#computeSum();
    this.#createVars();
    this.#createRentString();
    this.#insertFinalSum();
  }

  #createVars() {
    this.fees = ADD_FEE;
    this.days = this.#computeDays();
    this.price = PRICE;
    this.discounts = FEES_DISC;
  }

  #computeSum() {
    this.sumRent = this.#sumRent();
    this.sumDiscount = OrderCard.sumDiscount();
    this.finalSum = this.#computeFinal();
  }

  #computeDays() {
    const start = OrderCard.formattedDate(this.startDate.value);
    const end = OrderCard.formattedDate(this.endDate.value);

    const date1 = new Date(start);
    const date2 = new Date(end);

    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    let diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays < 1) diffInDays = DEFAULT_DAYS;
    return diffInDays;
  }

  #sumRent() {
    let sum = 0;
    sum = this.price * this.days;
    return sum;
  }

  #computeFinal() {
    const sumDisc = this.sumRent - this.sumDiscount;
    return sumDisc;
  }

  #createRentString() {
    const days = Number.isNaN(this.days) ? 0 : this.days;
    const priceFormatted = Number.isNaN(this.price) ? 0 : this.price.toLocaleString('ru-RU');
    const string = `${priceFormatted}₽ х ${days} суток`;

    const sumRentFormatted = Number.isNaN(this.sumRent) ? 0 : this.sumRent.toLocaleString('ru-RU');
    const sumString = `${sumRentFormatted}₽`;

    this.card.querySelector(`.${DAYS_COMPUTE}`).innerText = string;
    this.card.querySelector(`.${DAYS_COMPUTED}`).innerText = sumString;
  }

  #createFeeString() {
    let discountStr = 'Сбор за услуги:';
    let tip = null;
    discountStr += ` скидка ${FEES_DISC.toLocaleString(
      'ru-RU',
    )}₽`;

    tip = OrderCard.createTip();

    this.card.querySelector(`.${FEE_COMPUTE}`).innerText = discountStr;
    this.card.querySelector(`.${FEE_COMPUTE}`).append(tip);
    const messageTip = OrderCard.createMessageTip('Какое-нибудь важное сообщение', tip);
    document.body.append(messageTip);

    this.card.querySelector(
      `.${FEE_COMPUTED}`,
    ).innerText = '0₽';
  }

  #createAddFeeString() {
    const string = `Сбор за дополнительные 
    услуги`;
    this.card.querySelector(`.${ADD_FEE_COMPUTE}`).innerText = string;

    const tip = OrderCard.createTip();
    this.card.querySelector(`.${ADD_FEE_COMPUTE}`).append(tip);
    const messageTip = OrderCard.createMessageTip('Доп. услуги включают в себя помощь с доставкой багажа', tip);
    document.body.append(messageTip);

    this.card.querySelector(
      `.${ADD_FEE_COMPUTED}`,
    ).innerText = `${ADD_FEE}₽`;
  }

  #insertFinalSum() {
    const finalSum = Number.isNaN(this.finalSum) ? 0 : this.finalSum.toLocaleString('ru-RU');
    this.card.querySelector(
      `.${SUM}`,
    ).innerText = `${finalSum}₽`;
  }

  static handleTipMouseEnter({ target }) {
    OrderCard.handleShowMessage(target);
  }

  static handleTipMouseOut({ target }) {
    OrderCard.handleHideMessage(target);
  }

  static handleTipFocus({ target }) {
    OrderCard.handleShowMessage(target);
  }

  static handleTipBlur({ target }) {
    OrderCard.handleHideMessage(target);
  }

  static handleShowMessage(target) {
    const elemID = target.dataset.IDTip;
    const coords = {
      x: target.getBoundingClientRect().x,
      y: target.getBoundingClientRect().y,
    };
    OrderCard.showMessage(elemID, coords);
  }

  static handleHideMessage(target) {
    const elemID = target.dataset.IDTip;
    const message = document.querySelector(`.order-card__tip-message[data-id-message="${elemID}"]`);
    message.style.display = 'none';
  }

  static formattedDate(date) {
    const result = date.split('.').reverse().join('-');
    return result;
  }

  static sumDiscount() {
    return FEES_DISC - ADD_FEE;
  }

  static createTip() {
    const el = document.createElement('div');
    el.className = 'order-card__tip js-order-card__tip';
    el.innerText = 'i';

    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.dataset.IDTip = uuidv4();
    el.tabIndex = 0;
    return el;
  }

  static createMessageTip(information, tip) {
    const el = document.createElement('div');
    el.className = 'order-card__tip-message js-order-card__tip-message';
    el.innerText = information;
    el.style.display = 'none';
    el.dataset.idMessage = tip.dataset.IDTip;

    return el;
  }

  static showMessage(elemID, coords = {}) {
    if (elemID === undefined || elemID === null) return;
    const message = document.querySelector(`.order-card__tip-message[data-id-message="${elemID}"]`);
    if (!message) return;

    const { x, y } = coords;
    message.style.display = 'block';
    message.style.position = 'fixed';
    message.style.left = `${x + 22}px`;
    message.style.top = `${y + 20}px`;
  }
}

export default OrderCard;
