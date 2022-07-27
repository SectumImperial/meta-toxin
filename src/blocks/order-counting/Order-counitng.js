// Just imitation of counting
import {
  DAYS_COMPUTE,
  DAYS_COMPUTED,
  FEE_COMPUTE,
  FEE_COMPUTED,
  ADD_FEE_COMPUTE,
  ADD_FEE_COMPUTED,
  SUM,
} from './constnts';

class OrderCount {
  constructor(element) {
    this.count = element;

    try {
      this.options = JSON.parse(this.count.dataset.count);
    } catch (err) {
      throw new Error('Ошибка в чтении опций counting', err);
    }

    this.init();
  }

  init() {
    this.#createVars();
    this.#computeVars();
    this.#createRentString();
    this.#createFeeString();
    this.#createAddFeeString();
    this.#insertFinalSum();
  }

  #createVars() {
    this.fees = this.options.fees;
    this.days = this.options.days;
    this.price = this.options.price;
    this.discounts = this.options.discounts;
  }

  #computeVars() {
    this.sumRent = this.#sumRnet();
    this.allSum = this.#sumAll(this.sumRent);
    this.finalSum = this.#computeFinal(this.allSum);
  }

  #sumRnet() {
    let sum = 0;
    sum = this.price * this.days;
    return sum;
  }

  #sumAll(sumRent) {
    let sumFees = sumRent;
    Object.keys(this.fees).forEach((fee) => {
      if (this.fees[fee].count) {
        sumFees += this.fees[fee].count;
      }
    });

    return sumFees;
  }

  #computeFinal(sum) {
    let sumDisc = sum;
    Object.keys(this.discounts).forEach((discount) => {
      if (this.discounts[discount].count) {
        sumDisc -= this.discounts[discount].count;
      }
    });

    return sumDisc;
  }

  #createRentString() {
    const priceFrmtd = this.price.toLocaleString('ru-RU');
    const string = `${priceFrmtd}₽ х ${this.days} суток`;

    const sumRentFrmt = this.sumRent.toLocaleString('ru-RU');
    const sumString = `${sumRentFrmt}₽`;

    this.count.querySelector(`.${DAYS_COMPUTE}`).innerText = string;
    this.count.querySelector(`.${DAYS_COMPUTED}`).innerText = sumString;
  }

  #createFeeString() {
    let discountStr = 'Сбор за услуги:';
    let tip = null;
    if (this.discounts.feeDisc.count) {
      discountStr += ` скидка ${this.discounts.feeDisc.count.toLocaleString(
        'ru-RU',
      )}₽`;

      tip = OrderCount.createTip(this.discounts.feeDisc.message);
    }

    this.count.querySelector(`.${FEE_COMPUTE}`).innerText = discountStr;
    if (tip) {
      this.count.querySelector(`.${FEE_COMPUTE}`).append(tip);
    }

    this.count.querySelector(
      `.${FEE_COMPUTED}`,
    ).innerText = `${this.fees.fee.count}₽`;
  }

  #createAddFeeString() {
    const string = `Сбор за дополнительные 
    услуги`;
    this.count.querySelector(`.${ADD_FEE_COMPUTE}`).innerText = string;

    const tip = OrderCount.createTip(this.fees.fee.message);
    if (tip) {
      this.count.querySelector(`.${ADD_FEE_COMPUTE}`).append(tip);
    }

    this.count.querySelector(
      `.${ADD_FEE_COMPUTED}`,
    ).innerText = `${this.fees.addFee.count}₽`;
  }

  #insertFinalSum() {
    this.count.querySelector(
      `.${SUM}`,
    ).innerText = `${this.finalSum.toLocaleString('ru-RU')}₽`;
  }

  static createTip(information) {
    const el = document.createElement('div');
    el.className = 'order-counting__tip js-order-counting__tip';
    el.innerText = 'i';

    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.dataset.information = information;
    el.tabIndex = 0;

    return el;
  }
}
export default OrderCount;
