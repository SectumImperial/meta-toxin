'use strict'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'

const container = document.querySelector('._datepick-js')

if (container) {
  try {
    let firstItem, secondItem, rangeFrom, rangeTo
    let items = document.querySelectorAll('._datepickItem')
    let formGroups = Array.from(container.querySelectorAll('.form__group'))
    let buttonClear = document.querySelector('.datepick__button_clear')

    function addPoitRange(startPoin, endPoint) {
      if (
        startPoin &&
        startPoin.classList.contains('-selected-') &&
        !startPoin.classList.contains('start-range')
      ) {
        startPoin.classList.add('start-range')
      }

      if (
        endPoint &&
        endPoint.classList.contains('-selected-') &&
        !endPoint.classList.contains('end-range')
      ) {
        endPoint.classList.add('end-range')
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

    function formatDate(date) {
      let day =
        `${date.getDate()}`.length < 2 ? `0${date.getDate()}` : date.getDate()
      let month =
        `${date.getMonth()}`.length < 2
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      let year = date.getFullYear()
      let result = `${day}.${month}.${year}`
      return result
    }

    // function checkValues(elems, pattern) {
    //   // elems.
    // }

    // --------------- Создать календарь -----------------
    // Создать контейнер
    let calConteiner = document.querySelector('.datepick_container')
    let dp = new AirDatepicker(calConteiner, {
      range: true,
    })
    dp.show()

    if (container.classList.contains('_datepick-2')) {
      firstItem = container.querySelector('.datepick-start')
      secondItem = container.querySelector('.datepick-end')
    }

    if (container.classList.contains('_datepick-1'))
      item = container.querySelector('.form_datepick-single')

    // Работа скрытия и показа календаря при кликах на поля
    container.addEventListener('click', ({ target }) => {
      if (target.closest('.datepick_container')) return
      if (target.classList.contains('air-datepicker-cell')) return

      let targetContainer = target.closest('.form__group')
      let sibling = [...formGroups.filter((e) => e !== targetContainer)][0]

      // Клик по сосденему инпуту после клика на первый, календарь не закрывается
      if (
        !targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        calConteiner.classList.contains('_active')
      ) {
        targetContainer.classList.toggle('clicked')
        return
      }

      // Закрыть календарь и снять все clicked на элементах в случае повторонго клика по любому элементу при открытом календаре
      if (
        targetContainer.classList.contains('clicked') &&
        sibling.classList.contains('clicked') &&
        calConteiner.classList.contains('_active')
      ) {
        targetContainer.classList.remove('clicked')
        sibling.classList.remove('clicked')
        calConteiner.classList.remove('_active')
        return
      }

      targetContainer.classList.toggle('clicked')
      calConteiner.classList.toggle('_active')
    })

    // Форматирование заголовка согласно макету
    let title = container.querySelector('.air-datepicker-nav--title')
    title.textContent = title.textContent.replace(', ', ' ')

    // Очистка выбранных дат
    buttonClear.addEventListener('click', (e) => {
      e.preventDefault()
      firstItem.value = ''
      secondItem.value = ''
      dp.clear()
    })

    // Ручной ввод дат

    items.forEach((item) => {
      item.addEventListener('change', ({ target }) => {
        let correctFormat = [...items].every(({ value, pattern }) => {
          return value.match(pattern)
        })

        if (correctFormat) {
          let dates = Array.from(
            [...items].map((inputElement) => inputElement.value)
          ).map((e) => e.split('.').reverse().join('.').replaceAll('.', '-'))
          dp.selectDate(dates)
          rangeFrom = container.querySelector('.-range-from-')
          rangeTo = container.querySelector('.-range-to-')
          addPoitRange(rangeFrom, rangeTo)
          clearRange(container, 'start-range')
          clearRange(container, 'end-range')
        }
      })
    })

    // --------------- Настроить выделение диапазона и обработать клики-----------------

    calConteiner.addEventListener('click', ({ target }) => {
      // Отображение дат в полях
      if (dp.rangeDateFrom) {
        firstItem.value = formatDate(dp.rangeDateFrom)
      }

      if (dp.rangeDateTo) {
        secondItem.value = formatDate(dp.rangeDateTo)
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
    })
  } catch (err) {
    console.error(err)
  }
}
