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

    calContent.addEventListener('click', ({ targetClick }) => {
      // Удаление старых линий диапазона при выборе нового
      let startRangeLine = calContent.querySelector('.start-range')
      let endRangeLine = calContent.querySelector('.end-range')
      if (
        startRangeLine &&
        !startRangeLine.classList.contains('-selected-') &&
        endRangeLine &&
        !endRangeLine.classList.contains('-selected-')
      ) {
        startRangeLine.classList.remove('start-range')
        endRangeLine.classList.remove('end-range')
      }

      let rangeFrom = calContent.querySelector('.-range-from-')
      let rangeTo = calContent.querySelector('.-range-to-')

      // Переменная для пред. дня при движении мыши во время выделения диапазона
      let prevDay
      // Выделить диапазон при движеии мыши
      calContent.addEventListener('mouseover', ({ target, relatedTarget }) => {
        rangeFrom = calContent.querySelector('.-range-from-')
        rangeTo = calContent.querySelector('.-range-to-')

        // Назначить переменной пред. дня значение
        if (relatedTarget && !relatedTarget.classList.contains('-days-')) {
          prevDay = relatedTarget
        }

        // Добавить выделение диапазона при движении мыши
        if (
          target.classList.contains('-range-to-') &&
          !target.classList.contains('-range-from-')
        ) {
          target.classList.add('end-range')
          console.log('add class range')
          if (prevDay) prevDay.classList.remove('end-range')
        }

        if (
          target.classList.contains('-range-from-') &&
          !target.classList.contains('-range-to-')
        ) {
          target.classList.add('start-range')
          console.log('add class range')
          if (prevDay) prevDay.classList.remove('start-range')
        }

        // Удаление выделения диапазона у элементов там, где это не нужно при быстром движении мыши или выход за контейнер.
        let startRangeLines = [...calContent.querySelectorAll('.start-range')]
        let endRangeLines = [...calContent.querySelectorAll('.end-range')]
        startRangeLines.forEach((e) => {
          if (
            !e.classList.contains('-range-from-') &&
            !e.classList.contains('-selected-')
          ) {
            e.classList.remove('start-range')
          }
        })

        endRangeLines.forEach((e) => {
          if (
            !e.classList.contains('-range-to-') &&
            !e.classList.contains('-selected-')
          ) {
            e.classList.remove('end-range')
          }
        })

        // Удалить выделение диапазона в случае возврата мыши к выбранной дате
        if (
          rangeFrom.classList.contains('-focus-') &&
          rangeFrom.classList.contains('-range-to-') &&
          rangeFrom.classList.contains('-range-from-') &&
          rangeFrom.classList.contains('-selected-')
        ) {
          rangeFrom.classList.remove('end-range')
          rangeFrom.classList.remove('start-range')
          console.log('remove class range')
        }

        // Добавить класс выделения диапазона первому и последнему выбранному элементу
        if (rangeFrom && rangeFrom.classList.contains('-selected-')) {
          rangeFrom.classList.add('start-range')
        }

        if (rangeTo && rangeTo.classList.contains('-selected-')) {
          rangeTo.classList.add('end-range')
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
}
