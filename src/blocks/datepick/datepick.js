'use strict'

import AirDatepicker from 'air-datepicker'
import { MONTS } from './constants'

class Datepicker {
  constructor(element) {
    this.datepick = element
    this.init()
  }

  init() {
    this.createElems(this.datepick)
    this.createDatepicker()
    this.addButtonsArrow()
    this.checkBtnVisibility([...this.items])
    this.addListeners()
  }

  createElems(container) {
    this.items = container.querySelectorAll('._datepickItem')
    this.formGroups = Array.from(container.querySelectorAll('.datepick__group'))
    this.buttonClear = container.querySelector('.datepick__button_clear')
    this.buttonAccept = container.querySelector('.datepick__button_accept')

    if (container.classList.contains('_datepick-1')) this.singleInputMod = true
    if (container.classList.contains('_datepick-2')) this.twoInputMod = true

    this.rangeFrom
    this.rangeTo
  }

  createDatepicker() {
    this.calConteiner = this.datepick.querySelector('.datepick__container')
    this.dp = new AirDatepicker(this.calConteiner, {
      range: true,
    })
    this.dp.show()

    if (this.twoInputMod) {
      this.firstItem = this.datepick.querySelector('.datepick-start')
      this.secondItem = this.datepick.querySelector('.datepick-end')
    }

    if (this.singleInputMod) {
      this.singleItem = this.datepick.querySelector('.datepick-dates')
    }

    this.formatTitle()
    if (this.getUrlParams()) {
      this.getUrlValues()
    } else {
      this.setPrev()
    }
  }

  addListeners() {
    this.datepick.addEventListener('click', this.clickInputOpen.bind(this))
    this.buttonClear.addEventListener('click', this.clear.bind(this))
    this.buttonAccept.addEventListener('click', this.accept.bind(this))
    this.items.forEach((item) => {
      item.addEventListener('input', this.inputDate.bind(this))
    })
    this.calConteiner.addEventListener('click', this.checkRange.bind(this))
    document.addEventListener('click', this.closeOuterClick.bind(this))
  }

  closeOuterClick({ target }) {
    if (target.closest('._datepick-js')) return
    this.datepick.querySelectorAll('.datepick__group').forEach((e) => {
      if (e.classList.contains('clicked')) e.classList.remove('clicked')
      if (this.calConteiner.classList.contains('_active-dp'))
        this.calConteiner.classList.remove('_active-dp')
    })
  }

  getUrlParams() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    const startUrlDateString = urlParams.get('datepick-input-start')
    const endUrlDateString = urlParams.get('datepick-input-end')

    if ((startUrlDateString, endUrlDateString))
      return [startUrlDateString, endUrlDateString]
    else return false
  }

  getUrlValues() {
    if (this.singleInputMod) {
      const queryString = window.location.search

      const [startUrlDateString, endUrlDateString] = this.getUrlParams()

      if ((startUrlDateString, endUrlDateString)) {
        const [firstDay, firstmonth, firstyear] = startUrlDateString.split('.')
        const [secondDay, secondmonth, secondyear] = endUrlDateString.split('.')

        const startDate = new Date(firstyear, firstmonth, firstDay)
        const endDate = new Date(secondyear, secondmonth, secondDay)

        this.dp.selectDate([startDate, endDate])
        this.singleItem.value = this.formatDate(startDate, endDate)
        this.setPointRange()
        this.performRange(this.rangeFrom, this.rangeTo)
      }
    }
  }

  checkBtnVisibility(itemsArr) {
    let addedValue
    if (this.twoInputMod) {
      addedValue = itemsArr.every((e) => e.value !== '')
    }

    if (this.singleInputMod) {
      addedValue = this.singleItem.value !== ''
    }

    if (addedValue) this.buttonClear.style.visibility = 'visible'
    if (!addedValue) this.buttonClear.style.visibility = 'hidden'
  }

  // Методы выделения диапазона
  performRange(rangeFrom, rangeTo) {
    this.clearRange(this.datepick, 'start-range')
    this.clearRange(this.datepick, 'end-range')
    this.deletePoitRange(rangeFrom)
    this.deletePoitRange(rangeTo)
    this.addPoitRange(rangeFrom, rangeTo)
  }

  addPoitRange(startPoint, endPoint) {
    if (
      startPoint &&
      startPoint.classList.contains('-selected-') &&
      !startPoint.classList.contains('start-range')
    ) {
      startPoint.classList.add('start-range')
    }

    if (
      endPoint &&
      endPoint.classList.contains('-selected-') &&
      !endPoint.classList.contains('end-range')
    ) {
      endPoint.classList.add('end-range')
    }
  }

  deletePoitRange(point) {
    if (
      point &&
      point.classList.contains('end-range') &&
      point.classList.contains('start-range')
    ) {
      point.classList.remove('start-range')
      point.classList.remove('end-range')
    }
  }

  clearRange(container, rangeLineClass) {
    let elems = [...container.querySelectorAll(`.${rangeLineClass}`)]
    if (elems.length === 0) return
    elems.forEach((el) => {
      if (
        !el.classList.contains(rangeLineClass) &&
        !el.classList.contains('-selected-')
      ) {
        el.classList.remove(rangeLineClass)
      }

      if (
        !el.classList.contains('-selected-') &&
        !el.classList.contains('-focus-')
      ) {
        el.classList.remove(rangeLineClass)
      }
    })
  }

  // Конец методов выделения диапазона

  formatDate(firstDate, secondDate = '') {
    if (secondDate !== '' && this.singleInputMod) {
      let firstDay = firstDate.getDate()
      let secondDay = secondDate.getDate()
      let fistMonth = firstDate
        .toLocaleString('default', { month: 'long' })
        .substring(0, 3)
      let secondMonth = secondDate
        .toLocaleString('default', { month: 'long' })
        .substring(0, 3)

      let result = `${firstDay} ${fistMonth} - ${secondDay} ${secondMonth}`
      return result
    }

    if (secondDate === '' && this.twoInputMod) {
      let day =
        `${firstDate.getDate()}`.length < 2
          ? `0${firstDate.getDate()}`
          : firstDate.getDate()
      let month =
        `${firstDate.getMonth()}`.length < 2
          ? `0${firstDate.getMonth() + 1}`
          : firstDate.getMonth() + 1
      let year = firstDate.getFullYear()
      let result = `${day}.${month}.${year}`
      return result
    }
  }

  addDateCal(items) {
    if (this.twoInputMod) {
      let dates = Array.from(
        [...items].map((inputElement) => inputElement.value)
      ).map((e) => e.split('.').reverse().join('.').replaceAll('.', '-'))
      this.dp.selectDate(dates)
    }

    if (this.singleInputMod) {
      let dates = this.singleItem.value.split(' - ')
      let [firstValue, secondValue] = dates

      let firstDate = this.recreateDate(firstValue)
      let secondDate = this.recreateDate(secondValue)

      this.dp.selectDate([firstDate, secondDate])
    }
  }

  recreateDate(invalidDate) {
    let [day, month] = invalidDate.split(' ')
    month = month.charAt(0).toUpperCase() + month.slice(1)
    month = MONTS.indexOf(month)

    let date = new Date(2022, month, day)
    return date
  }

  deleteComma(elem) {
    let text = elem.innerText
    text = text.replace(',', '').replace('\n', ' ')
    return text
  }

  addButtonsArrow() {
    let navButtons = this.datepick.querySelectorAll(
      '.air-datepicker-nav--action'
    )
    navButtons.forEach((e) => {
      e.classList.add('icon__arrow_forward')
    })
  }

  formatTitle() {
    let navTitle = this.datepick.querySelector('.air-datepicker-nav--title')
    navTitle.innerText = this.deleteComma(navTitle)
  }

  clickInputOpen({ target }) {
    let targetContainer = target.closest('.datepick__group')
    if (!targetContainer) return

    if (this.twoInputMod) {
      let sibling = [...this.formGroups.filter((e) => e !== targetContainer)][0]

      // Клик по сосденему инпуту после клика на первый, календарь не закрывается
      if (
        !targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        this.calConteiner.classList.contains('_active-dp')
      ) {
        targetContainer.classList.toggle('clicked')
        return
      }

      // Закрыть календарь и снять все clicked на элементах в случае повторонго клика по любому элементу при открытом календаре
      if (
        targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        this.calConteiner.classList.contains('_active-dp')
      ) {
        targetContainer.classList.remove('clicked')
        sibling.classList.remove('clicked')
        this.calConteiner.classList.remove('_active-dp')
        return
      }

      targetContainer.classList.toggle('clicked')
      this.calConteiner.classList.toggle('_active-dp')
    }

    if (this.singleInputMod) {
      targetContainer.classList.toggle('clicked')
      this.calConteiner.classList.toggle('_active-dp')
    }
  }

  clear(e) {
    e.preventDefault()
    if (this.twoInputMod) {
      this.firstItem.value = ''
      this.secondItem.value = ''
    }

    if (this.singleInputMod) {
      this.singleItem.value = ''
    }
    this.dp.clear()
  }

  accept(e) {
    e.preventDefault()

    if (this.dp.rangeDateFrom || this.dp.rangeDateTo) {
      this.calConteiner.classList.remove('_active-dp')
    }
  }

  inputDate() {
    let correctFormat = [...this.items].every(({ value, pattern }) => {
      return value.match(pattern)
    })

    if (correctFormat) {
      this.addDateCal(this.items)

      this.setPointRange()

      if (this.firstItem.value === this.secondItem.value) {
        let date = secondItem.value.split('.')
        let day = date[0]
        day++
        date.splice(0, 1, day)
        this.secondItem.value = date.join('.')

        this.addDateCal(items)
        this.setPointRange()
        this.performRange(this.rangeFrom, this.rangeTo)
      }
      if (this.firstItem.value > this.secondItem.value) {
        ;[this.firstItem.value, sthis.econdItem.value] = [
          this.secondItem.value,
          this.firstItem.value,
        ]
        this.performRange(this.rangeFrom, this.rangeTo)
        this.addDateCal(items)
      }
      if (this.firstItem.value !== this.secondItem.value) {
        this.performRange(this.rangeFrom, this.rangeTo)
      }
    }
  }

  checkRange({ target }) {
    let navTitle = this.datepick.querySelector('.air-datepicker-nav--title')
    navTitle.innerText = this.deleteComma(navTitle)

    // Отображение дат в полях

    if (this.twoInputMod) {
      if (this.dp.rangeDateFrom) {
        this.firstItem.value = this.formatDate(this.dp.rangeDateFrom)
      }

      if (this.dp.rangeDateTo) {
        this.secondItem.value = this.formatDate(this.dp.rangeDateTo)
      }
    }

    if (this.singleInputMod && this.dp.rangeDateFrom && this.dp.rangeDateTo) {
      this.singleItem.value = this.formatDate(
        this.dp.rangeDateFrom,
        this.dp.rangeDateTo
      )
    }

    // Удаление старых линий диапазона при выборе нового
    this.clearRange(this.datepick, 'start-range')
    this.clearRange(this.datepick, 'end-range')

    // Настройка ячеек при смене месяца
    this.setPointRange()

    if (target.classList.contains('air-datepicker-nav--action')) {
      this.addPoitRange(this.rangeFrom, this.rangeTo)
    }

    // Выделить диапазон при движеии мыши
    this.datepick.addEventListener('mousemove', ({ target, relatedTarget }) => {
      this.setPointRange()

      // Переменная для пред. дня при движении мыши во время выделения диапазона
      let prevDay

      this.addPoitRange(this.rangeFrom, this.rangeTo)

      if (this.rangeFrom && this.rangeFrom.classList.contains('end-range')) {
        this.rangeFrom.classList.remove('end-range')
      }

      // Назначить переменной пред. дня значение
      if (relatedTarget && !relatedTarget.classList.contains('-days-')) {
        prevDay = relatedTarget
      }

      // Добавить выделение диапазона при движении мыши
      if (
        target.classList.contains('-range-to-') &&
        !target.classList.contains('-range-from-') &&
        !target.classList.contains('-selected-')
      ) {
        target.classList.add('end-range')
        if (prevDay) prevDay.classList.remove('end-range')
      }

      if (
        target.classList.contains('-range-from-') &&
        !target.classList.contains('-range-to-') &&
        !target.classList.contains('-selected-')
      ) {
        target.classList.add('start-range')
        if (prevDay) prevDay.classList.remove('start-range')
      }

      // Удаление выделения диапазона у элементов там, где это не нужно при быстром движении мыши или выход за контейнер.
      this.clearRange(this.datepick, 'start-range')
      this.clearRange(this.datepick, 'end-range')

      // Удалить выделение диапазона в случае возврата мыши к выбранной дате
      if (
        this.rangeFrom &&
        this.rangeFrom.classList.contains('-focus-') &&
        this.rangeFrom.classList.contains('-range-to-') &&
        this.rangeFrom.classList.contains('-range-from-') &&
        this.rangeFrom.classList.contains('-selected-')
      ) {
        this.rangeFrom.classList.remove('end-range')
        this.rangeFrom.classList.remove('start-range')
      }
    })

    this.checkBtnVisibility([this.firstItem, this.secondItem])
  }

  setPointRange() {
    this.rangeFrom = this.datepick.querySelector('.-range-from-')
    this.rangeTo = this.datepick.querySelector('.-range-to-')
  }

  setPrev() {
    const current = new Date()
    let year = current.getFullYear()
    let month = current.getMonth()
    let day = current.getDate()

    let tommorow = new Date(year, month, day + 1)
    let fourAfer = new Date(year, month, day + 5)

    if (this.twoInputMod) {
      this.firstItem.value = this.formatDate(tommorow)
      this.secondItem.value = this.formatDate(fourAfer)
      this.addDateCal(this.items)
      this.setPointRange()
    }

    if (this.singleInputMod) {
      this.singleItem.value = this.formatDate(tommorow, fourAfer)
      this.addDateCal(this.items)
      this.setPointRange()
    }

    this.performRange(this.rangeFrom, this.rangeTo)
  }
}

export default Datepicker
