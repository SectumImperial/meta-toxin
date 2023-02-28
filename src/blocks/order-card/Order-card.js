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
  TIP,
} from './constants';

class OrderCard {
  constructor(element) {
    this.card = element;

    this.handleDatepickerInput = this.handleDatepickerInput.bind(this);
    this.handleDatepickerInput = this.handleDatepickerInput.bind(this);
    this.handleDatepickerClick = this.handleDatepickerClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    OrderCard.handleTipMouseEnter = OrderCard.handleTipMouseEnter.bind(this);
    OrderCard.handleTipMouseOut = OrderCard.handleTipMouseOut.bind(this);
    OrderCard.handleTipFocus = OrderCard.handleTipFocus.bind(this);
    OrderCard.handleTipBlur = OrderCard.handleTipBlur.bind(this);

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
    this.#addResizeObserver();
    return this;
  }

  static updateTipPosition(tip, message) {
    const coords = {
      x: tip.getBoundingClientRect().x,
      y: tip.getBoundingClientRect().y,
    };

    OrderCard.setMessagePosition(coords, message);
    return this;
  }

  static handleTipMouseEnter({ target }) {
    OrderCard.handleShowMessage(target);
    return this;
  }

  static handleTipMouseOut({ target }) {
    OrderCard.handleHideMessage(target);
    return this;
  }

  static handleTipFocus({ target }) {
    OrderCard.handleShowMessage(target);
    return this;
  }

  static handleTipBlur({ target }) {
    OrderCard.handleHideMessage(target);
    return this;
  }

  static handleShowMessage(target) {
    const elemID = target.dataset.idTip;
    const coords = {
      x: target.getBoundingClientRect().x,
      y: target.getBoundingClientRect().y,
    };
    OrderCard.showMessage(elemID, coords);
    return this;
  }

  static handleHideMessage(target) {
    const elemID = target.dataset.idTip;
    const message = document.querySelector(`.order-card__tip-message[data-id-message="${elemID}"]`);
    if (message.classList.contains('order-card__tip-message_show')) message.classList.remove('order-card__tip-message_show');
    return this;
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
    el.dataset.idTip = uuidv4();
    el.tabIndex = 0;
    return el;
  }

  static createMessageTip(information, tip) {
    const el = document.createElement('div');
    el.className = 'order-card__tip-message js-order-card__tip-message';
    el.innerText = information;
    el.dataset.idMessage = tip.dataset.idTip;

    return el;
  }

  static showMessage(elemID, coords = {}) {
    if (elemID === undefined && elemID === null) return;
    const message = OrderCard.findMessage(elemID);
    if (message === undefined) return;
    message.classList.add('order-card__tip-message_show');
    OrderCard.setMessagePosition(coords, message);
  }

  static setMessagePosition(coords, message) {
    const { x, y } = coords;
    const messageTip = message;

    if (window.innerWidth < 370) {
      messageTip.style.left = `${x - 42}px`;
      messageTip.style.top = `${y + 20}px`;
    } else {
      messageTip.style.left = `${x + 22}px`;
      messageTip.style.top = `${y + 20}px`;
    }
    return this;
  }

  static findMessage(elemID) {
    return document.querySelector(`.order-card__tip-message[data-id-message="${elemID}"]`);
  }

  #addListeners() {
    this.startDate.addEventListener('input', this.handleDatepickerInput);
    this.endDate.addEventListener('input', this.handleDatepickerInput);
    this.datepicker.addEventListener('click', this.handleDatepickerClick);
    document.addEventListener('click', this.handleDocumentClick);
    this.card.querySelectorAll(`.${TIP}`).forEach((e) => {
      e.addEventListener('mouseenter', OrderCard.handleTipMouseEnter);
      e.addEventListener('mouseout', OrderCard.handleTipMouseOut);
      e.addEventListener('focus', OrderCard.handleTipFocus);
      e.addEventListener('blur', OrderCard.handleTipBlur);
    });

    document.addEventListener('scroll', this.handleDocumentScroll);
    return this;
  }

  handleDocumentScroll() {
    this.card.querySelectorAll(`.${TIP}`).forEach((tip) => {
      const { idTip } = tip.dataset;
      if (idTip.length > 0) {
        const message = OrderCard.findMessage(tip.dataset.idTip);
        if (message.classList.contains('order-card__tip-message_show')) {
          OrderCard.updateTipPosition(tip, message);
        }
      }
    });
    return this;
  }

  handleDatepickerInput() {
    this.#updateCounting();
    return this;
  }

  handleDatepickerClick() {
    this.#updateCounting();
    return this;
  }

  handleDocumentClick() {
    this.#updateCounting();
    return this;
  }

  #findElements() {
    this.startDate = this.card.querySelector(`.${START_DATE}`);
    this.endDate = this.card.querySelector(`.${END_DATE}`);
    this.datepicker = this.card.querySelector('.datepicker__container');
    return this;
  }

  #addResizeObserver() {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(() => {
        const tips = this.card.querySelectorAll(`.${TIP}`);
        if (tips.length <= 0) return;
        tips.forEach((tip) => {
          const elemID = tip.dataset.idTip;
          const message = OrderCard.findMessage(elemID);
          if (message.classList.contains('order-card__tip-message_show')) {
            const coords = {
              x: tip.getBoundingClientRect().x,
              y: tip.getBoundingClientRect().y,
            };
            OrderCard.setMessagePosition(coords, message);
          }
        });
      });
    });

    resizeObserver.observe(document.querySelector('body'));
    return this;
  }

  #updateCounting() {
    this.#computeSum();
    this.#createVars();
    this.#createRentString();
    this.#insertFinalSum();
    return this;
  }

  #createVars() {
    this.fees = ADD_FEE;
    this.days = this.#computeDays();
    this.price = PRICE;
    this.discounts = FEES_DISC;
    return this;
  }

  #computeSum() {
    this.sumRent = this.#sumRent();
    this.sumDiscount = OrderCard.sumDiscount();
    this.finalSum = this.#computeFinal();
    return this;
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
    return this;
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
    return this;
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
    return this;
  }

  #insertFinalSum() {
    const finalSum = Number.isNaN(this.finalSum) ? 0 : this.finalSum.toLocaleString('ru-RU');
    this.card.querySelector(
      `.${SUM}`,
    ).innerText = `${finalSum}₽`;
    return this;
  }
}

export default OrderCard;
