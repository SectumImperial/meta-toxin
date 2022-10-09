// Just imitation of counting
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

    tip = OrderCard.createTip('Какое-нибудь важное сообщение');

    this.card.querySelector(`.${FEE_COMPUTE}`).innerText = discountStr;
    this.card.querySelector(`.${FEE_COMPUTE}`).append(tip);

    this.card.querySelector(
      `.${FEE_COMPUTED}`,
    ).innerText = '0₽';
  }

  #createAddFeeString() {
    const string = `Сбор за дополнительные 
    услуги`;
    this.card.querySelector(`.${ADD_FEE_COMPUTE}`).innerText = string;

    const tip = OrderCard.createTip('Доп. услуги включают в себя помощь с доставкой багажа');
    this.card.querySelector(`.${ADD_FEE_COMPUTE}`).append(tip);

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

  static formattedDate(date) {
    const result = date.split('.').reverse().join('-');
    return result;
  }

  static sumDiscount() {
    return FEES_DISC - ADD_FEE;
  }

  static createTip(information) {
    const el = document.createElement('div');
    el.className = 'order-card__tip js-order-card__tip';
    el.innerText = 'i';

    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.dataset.information = information;
    el.tabIndex = 0;

    return el;
  }
}

export default OrderCard;
