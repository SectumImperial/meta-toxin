'use strict'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'

const container = document.querySelector('._datepick-js')

if (container) {
  let firstItem, secondItem, singleItem, rangeFrom, rangeTo
  let items = container.querySelectorAll('._datepickItem')
  let formGroups = Array.from(container.querySelectorAll('.datepick__group'))
  let buttonClear = container.querySelector('.datepick__button_clear')
  let buttonAccept = container.querySelector('.datepick__button_accept')

  const singleInputMod = container.classList.contains('_datepick-1')
  const twoInputMod = container.classList.contains('_datepick-2')

  buttonClear.style.visibility = 'hidden'

  function checkBtnVisibility(items) {
    let addedValue
    if (twoInputMod) {
      addedValue = items.every((e) => e.value !== '')
    }

    if (singleInputMod) {
      addedValue = singleItem.value !== ''
    }

    if (addedValue) buttonClear.style.visibility = 'visible'
    if (!addedValue) buttonClear.style.visibility = 'hidden'
  }

  function addPoitRange(startPoint, endPoint) {
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

  function deletePoitRange(point) {
    if (
      point &&
      point.classList.contains('end-range') &&
      point.classList.contains('start-range')
    ) {
      point.classList.remove('start-range')
      point.classList.remove('end-range')
    }
  }

  function clearRange(container, rangeLineClass) {
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

  function formatDate(firstDate, secondDate = '') {
    if (secondDate !== '' && singleInputMod) {
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

    if (secondDate === '' && twoInputMod) {
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

  function addDateCal(items) {
    let dates = Array.from(
      [...items].map((inputElement) => inputElement.value)
    ).map((e) => e.split('.').reverse().join('.').replaceAll('.', '-'))
    dp.selectDate(dates)
  }

  function performRange(rangeFrom, rangeTo) {
    clearRange(container, 'start-range')
    clearRange(container, 'end-range')
    deletePoitRange(rangeFrom)
    deletePoitRange(rangeTo)
    addPoitRange(rangeFrom, rangeTo)
  }

  function deleteComma(elem) {
    let text = elem.innerText
    text = text.replace(',', '').replace('\n', ' ')
    return text
  }

  // --------------- Создать календарь -----------------
  // Создать контейнер
  let calConteiner = document.querySelector('.datepick__container')
  let dp = new AirDatepicker(calConteiner, {
    range: true,
  })
  dp.show()

  if (twoInputMod) {
    firstItem = container.querySelector('.datepick-start')
    secondItem = container.querySelector('.datepick-end')
  }

  if (singleInputMod) {
    singleItem = container.querySelector('.datepick-dates')
  }

  // Получить данные из строки url и установить их в значение одного поля
  if (singleInputMod) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    const startDateString = urlParams.get('datepick-input-start')
    const endDateString = urlParams.get('datepick-input-end')

    const [firstDay, firstmonth, firstyear] = startDateString.split('.')
    const [secondDay, secondmonth, secondyear] = endDateString.split('.')

    const startDate = new Date(firstyear, firstmonth, firstDay)
    const endDate = new Date(secondyear, secondmonth, secondDay)

    if (startDate && endDate) singleItem.value = formatDate(startDate, endDate)
  }

  // Работа скрытия и показа календаря при кликах на поля
  container.addEventListener('click', ({ target }) => {
    let targetContainer = target.closest('.datepick__group')
    if (!targetContainer) return

    if (twoInputMod) {
      let sibling = [...formGroups.filter((e) => e !== targetContainer)][0]

      // Клик по сосденему инпуту после клика на первый, календарь не закрывается
      if (
        !targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        calConteiner.classList.contains('_active-dp')
      ) {
        targetContainer.classList.toggle('clicked')
        return
      }

      // Закрыть календарь и снять все clicked на элементах в случае повторонго клика по любому элементу при открытом календаре
      if (
        targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        calConteiner.classList.contains('_active-dp')
      ) {
        targetContainer.classList.remove('clicked')
        sibling.classList.remove('clicked')
        calConteiner.classList.remove('_active-dp')
        return
      }

      targetContainer.classList.toggle('clicked')
      calConteiner.classList.toggle('_active-dp')
    }

    if (singleInputMod) {
      targetContainer.classList.toggle('clicked')
      calConteiner.classList.toggle('_active-dp')
    }
  })

  // Форматирование заголовка согласно макету
  let navTitle = document.querySelector('.air-datepicker-nav--title')
  navTitle.innerText = deleteComma(navTitle)

  // Очистка выбранных дат
  buttonClear.addEventListener('click', (e) => {
    e.preventDefault()
    if (twoInputMod) {
      firstItem.value = ''
      secondItem.value = ''
    }

    if (singleInputMod) {
      singleItem.value = ''
    }
    dp.clear()
  })

  // Клик по кнопке принять
  buttonAccept.addEventListener('click', (e) => {
    e.preventDefault()
    if (dp.rangeDateFrom || dp.rangeDateTo) {
      calConteiner.classList.remove('_active-dp')
    }
  })

  // Ручной ввод дат

  if (twoInputMod) {
    items.forEach((item) => {
      item.addEventListener('input', () => {
        let correctFormat = [...items].every(({ value, pattern }) => {
          return value.match(pattern)
        })

        if (correctFormat) {
          addDateCal(items)

          rangeFrom = container.querySelector('.-range-from-')
          rangeTo = container.querySelector('.-range-to-')

          if (firstItem.value === secondItem.value) {
            let date = secondItem.value.split('.')
            let day = date[0]
            day++
            date.splice(0, 1, day)
            secondItem.value = date.join('.')

            addDateCal(items)
            rangeFrom = container.querySelector('.-range-from-')
            rangeTo = container.querySelector('.-range-to-')
            performRange(rangeFrom, rangeTo)
          }
          if (firstItem.value > secondItem.value) {
            ;[firstItem.value, secondItem.value] = [
              secondItem.value,
              firstItem.value,
            ]
            performRange(rangeFrom, rangeTo)
            addDateCal(items)
          }
          if (firstItem.value !== secondItem.value) {
            performRange(rangeFrom, rangeTo)
          }
        }
      })
    })
  }

  // --------------- Настроить выделение диапазона и обработать клики-----------------

  calConteiner.addEventListener('click', ({ target }) => {
    navTitle = document.querySelector('.air-datepicker-nav--title')
    navTitle.innerText = deleteComma(navTitle)

    // Отображение дат в полях

    if (twoInputMod) {
      if (dp.rangeDateFrom) {
        firstItem.value = formatDate(dp.rangeDateFrom)
      }

      if (dp.rangeDateTo) {
        secondItem.value = formatDate(dp.rangeDateTo)
      }
    }

    if (singleInputMod && dp.rangeDateFrom && dp.rangeDateTo) {
      singleItem.value = formatDate(dp.rangeDateFrom, dp.rangeDateTo)
    }

    // Удаление старых линий диапазона при выборе нового
    clearRange(container, 'start-range')
    clearRange(container, 'end-range')

    // Настройка ячеек при смене месяца
    rangeFrom = container.querySelector('.-range-from-')
    rangeTo = container.querySelector('.-range-to-')

    if (target.classList.contains('air-datepicker-nav--action')) {
      addPoitRange(rangeFrom, rangeTo)
    }

    // Выделить диапазон при движеии мыши
    container.addEventListener('mousemove', ({ target, relatedTarget }) => {
      rangeFrom = container.querySelector('.-range-from-')
      rangeTo = container.querySelector('.-range-to-')

      // Переменная для пред. дня при движении мыши во время выделения диапазона
      let prevDay

      addPoitRange(rangeFrom, rangeTo)

      if (rangeFrom && rangeFrom.classList.contains('end-range')) {
        rangeFrom.classList.remove('end-range')
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
      clearRange(container, 'start-range')
      clearRange(container, 'end-range')

      // Удалить выделение диапазона в случае возврата мыши к выбранной дате
      if (
        rangeFrom &&
        rangeFrom.classList.contains('-focus-') &&
        rangeFrom.classList.contains('-range-to-') &&
        rangeFrom.classList.contains('-range-from-') &&
        rangeFrom.classList.contains('-selected-')
      ) {
        rangeFrom.classList.remove('end-range')
        rangeFrom.classList.remove('start-range')
      }
    })

    checkBtnVisibility([firstItem, secondItem])
  })
}
