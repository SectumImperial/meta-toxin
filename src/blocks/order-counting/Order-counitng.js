class OrderCount {
  constructor(element) {
    this.count = element

    this.options
    try {
      this.options = JSON.parse(this.count.dataset.count)
    } catch (err) {
      throw new Error('Ошибка в чтении опций counting', err)
    }

    this.init()
  }

  init() {
    this.fees = this.options.fees
    this.days = this.options.days
    this.price = this.options.price
    this.discounts = this.options.discounts

    this.sumRent = this.sumRnet()
    this.allSum = this.sumAll(this.sumRent)
    this.finalSum = this.computeFinal(this.allSum)

    this.createRentString()
    this.createFeeString()
    this.createAddFeeString()
    this.insertFinalSum()
  }

  sumRnet() {
    let sum = 0
    sum = this.price * this.days
    return sum
  }

  sumAll(sumRent) {
    let sumFees = sumRent
    for (let fee in this.fees) {
      if (this.fees[fee].count) {
        sumFees += this.fees[fee].count
      }
    }

    return sumFees
  }

  computeFinal(sum) {
    let sumDisc = sum
    for (let discount in this.discounts) {
      if (this.discounts[discount].count) {
        sumDisc -= this.discounts[discount].count
      }
    }

    return sumDisc
  }

  createRentString() {
    const priceFrmtd = this.price.toLocaleString('ru-RU')
    const string = `${priceFrmtd}₽ х ${this.days} суток`

    const sumRentFrmt = this.sumRent.toLocaleString('ru-RU')
    const sumString = `${sumRentFrmt}₽`

    this.count.querySelector('.order-counting__days-compute').innerText = string
    this.count.querySelector('.order-counting__days-computed').innerText =
      sumString
  }

  createFeeString() {
    let discountStr = 'Сбор за услуги'
    let tip = null
    if (this.discounts.feeDisc.count) {
      discountStr += ` скидка ${this.discounts.feeDisc.count.toLocaleString(
        'ru-RU'
      )}₽`

      tip = this.createTip(this.discounts.feeDisc.message)
    }

    this.count.querySelector('.order-counting__fee-compute').innerText =
      discountStr
    if (tip) {
      this.count.querySelector('.order-counting__fee-compute').append(tip)
    }

    this.count.querySelector(
      '.order-counting__fee-computed'
    ).innerText = `${this.fees.fee.count}₽`
  }

  createAddFeeString() {
    let string = `Сбор за дополнительные 
    услуги`
    this.count.querySelector('.order-counting__add-fee-compute').innerText =
      string

    let tip = this.createTip(this.fees.fee.message)
    if (tip)
      this.count.querySelector('.order-counting__add-fee-compute').append(tip)

    this.count.querySelector(
      '.order-counting__add-fee-computed'
    ).innerText = `${this.fees.addFee.count}₽`
  }

  insertFinalSum() {
    this.count.querySelector(
      '.order-counting__sum'
    ).innerText = `${this.finalSum.toLocaleString('ru-RU')}₽`
  }

  createTip(information) {
    let el = document.createElement('div')
    el.className = 'order-counting__tip'
    el.innerText = 'i'

    el.style.width = '20px'
    el.style.height = '20px'
    el.style.borderRadius = '50%'
    el.dataset.information = information

    return el
  }
}
export default OrderCount
