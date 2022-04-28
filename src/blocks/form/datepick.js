'use strict'
import './datepicker.css'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'

const container = document.querySelector('._datepick-js')

if (container) {
  try {
    let item, firstItem, secondItem, currentFeild
    let formGroups = Array.from(container.querySelectorAll('.form__group'))

    // Создание контейнера для календаря
    let calConteiner = document.createElement('div')
    calConteiner.className = 'datepick_container'
    container.append(calConteiner)
    let dp = new AirDatepicker(calConteiner, {
      range: true,
    })
    dp.show()

    if (container.classList.contains('_datepick-2')) {
      firstItem = container.querySelector('.form_datepick-start')
      secondItem = container.querySelector('.form_datepick-end')
    }

    if (container.classList.contains('_datepick-1'))
      item = container.querySelector('.form_datepick-single')

    // Работа скрытия и показа календаря при кликах на поля
    container.addEventListener('click', ({ target }) => {
      if (target.closest('.datepick_container')) return

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

    // Настройка выделения ячеек диапазона

    let calContent = container.querySelector('.air-datepicker--content')
    let days = [...calContent.querySelectorAll('.-day-')]

    calContent.addEventListener('click', ({ target }) => {
      // Удаление старых линий диапазона при выборе нового
      let startRangeLine = calContent.querySelector('.start-range')
      let endRangeLine = calContent.querySelector('.end-range')

      let rangeFrom = calContent.querySelector('.-range-from-')
      let rangeTo = calContent.querySelector('.-range-to-')

      if (startRangeLine && endRangeLine) {
        startRangeLine.classList.remove('start-range')
        endRangeLine.classList.remove('end-range')
      }

      // Добавление новой линии во время движения
      let hasRangeFrom = days.some((e) => {
        return e.classList.contains('-range-from-')
      })

      if (rangeTo && !rangeTo.classList.contains('-selected-')) {
        calContent.addEventListener(
          'mouseover',
          ({ target, relatedTarget }) => {
            let hasRangeTo = days.some((e) => {
              return e.classList.contains('-range-to-')
            })

            if (hasRangeFrom && hasRangeTo) {
              rangeFrom.classList.add('start-range')
              relatedTarget.classList.remove('end-range')
              target.classList.add('end-range')
            }
          }
        )
      }

      if (rangeTo && rangeTo.classList.contains('-selected-')) {
        rangeTo.classList.add('end-range')
      }
    })
  } catch (err) {
    console.error(err)
  }
}
