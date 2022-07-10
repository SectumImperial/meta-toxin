// Just imitation of counting
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
    this.fees = this.options.fees;
    this.days = this.options.days;
    this.price = this.options.price;
    this.discounts = this.options.discounts;

    this.sumRent = this.sumRnet();
    this.allSum = this.sumAll(this.sumRent);
    this.finalSum = this.computeFinal(this.allSum);

    this.createRentString();
    this.createFeeString();
    this.createAddFeeString();
    this.insertFinalSum();
  }

  sumRnet() {
    let sum = 0;
    sum = this.price * this.days;
    return sum;
  }

  sumAll(sumRent) {
    let sumFees = sumRent;
    Object.keys(this.fees).forEach((fee) => {
      if (this.fees[fee].count) {
        sumFees += this.fees[fee].count;
      }
    });

    return sumFees;
  }

  computeFinal(sum) {
    let sumDisc = sum;
    Object.keys(this.discounts).forEach((discount) => {
      if (this.discounts[discount].count) {
        sumDisc -= this.discounts[discount].count;
      }
    });

    return sumDisc;
  }

  createRentString() {
    const priceFrmtd = this.price.toLocaleString('ru-RU');
    const string = `${priceFrmtd}₽ х ${this.days} суток`;

    const sumRentFrmt = this.sumRent.toLocaleString('ru-RU');
    const sumString = `${sumRentFrmt}₽`;

    this.count.querySelector('.order-counting__days_compute').innerText = string;
    this.count.querySelector('.order-counting__days_computed').innerText = sumString;
  }

  createFeeString() {
    let discountStr = 'Сбор за услуги:';
    let tip = null;
    if (this.discounts.feeDisc.count) {
      discountStr += ` скидка ${this.discounts.feeDisc.count.toLocaleString(
        'ru-RU',
      )}₽`;

      tip = OrderCount.createTip(this.discounts.feeDisc.message);
    }

    this.count.querySelector('.order-counting__fee_compute').innerText = discountStr;
    if (tip) {
      this.count.querySelector('.order-counting__fee_compute').append(tip);
    }

    this.count.querySelector(
      '.order-counting__fee_computed',
    ).innerText = `${this.fees.fee.count}₽`;
  }

  createAddFeeString() {
    const string = `Сбор за дополнительные 
    услуги`;
    this.count.querySelector('.order-counting__add-fee_compute').innerText = string;

    const tip = OrderCount.createTip(this.fees.fee.message);
    if (tip) {
      this.count.querySelector('.order-counting__add-fee_compute').append(tip);
    }

    this.count.querySelector(
      '.order-counting__add-fee_computed',
    ).innerText = `${this.fees.addFee.count}₽`;
  }

  insertFinalSum() {
    this.count.querySelector(
      '.order-counting__sum',
    ).innerText = `${this.finalSum.toLocaleString('ru-RU')}₽`;
  }

  static createTip(information) {
    const el = document.createElement('div');
    el.className = 'order-counting__tip';
    el.innerText = 'i';

    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.dataset.information = information;

    return el;
  }
}
export default OrderCount;
