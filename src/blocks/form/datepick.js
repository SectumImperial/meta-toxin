'use strict'
import './datepicker.css'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'

const container = document.querySelector('._datepick-js')

if (container) {
  try {
    let item, firstItem, secondItem, currentFeild
    let formGroups = Array.from(container.querySelectorAll('.form__group'))

    // --------------- Создать календарь -----------------
    // Создание контейнер
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

    // --------------- Настроить выделение диапазона -----------------

    calConteiner.addEventListener('click', ({ target }) => {
      // Удаление старых линий диапазона при выборе нового
      let startRangeLine = container.querySelector('.start-range')
      let endRangeLine = container.querySelector('.end-range')
      if (
        (startRangeLine && !startRangeLine.classList.contains('-selected-')) ||
        (endRangeLine && !endRangeLine.classList.contains('-selected-'))
      ) {
        startRangeLine.classList.remove('start-range')
        endRangeLine.classList.remove('end-range')
      }

      // Настройка ячеек при смене месяца
      let rangeFrom = container.querySelector('.-range-from-')
      let rangeTo = container.querySelector('.-range-to-')
      if (target.classList.contains('air-datepicker-nav--action')) {
        if (rangeFrom && !rangeTo) {
          rangeFrom.classList.add('start-range')
        }
        if (rangeTo && !rangeFrom) {
          rangeTo.classList.add('end-range')
        }
      }

      // Выделить диапазон при движеии мыши
      container.addEventListener('mouseover', ({ target, relatedTarget }) => {
        rangeFrom = container.querySelector('.-range-from-')
        rangeTo = container.querySelector('.-range-to-')

        // Переменная для пред. дня при движении мыши во время выделения диапазона
        let prevDay

        // Добавить класс выделения диапазона первому и последнему выбранному элементу
        if (
          rangeFrom &&
          rangeFrom.classList.contains('-selected-') &&
          !rangeFrom.classList.contains('start-range')
        ) {
          rangeFrom.classList.add('start-range')
        }

        if (
          rangeTo &&
          rangeTo.classList.contains('-selected-') &&
          !rangeTo.classList.contains('end-range')
        ) {
          rangeTo.classList.add('end-range')
        }

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
        let startRangeLines = [...container.querySelectorAll('.start-range')]
        let endRangeLines = [...container.querySelectorAll('.end-range')]
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

    // Форматирование заголовка согласно макету
    let title = container.querySelector('.air-datepicker-nav--title')
    title.textContent = title.textContent.replace(', ', ' ')
  } catch (err) {
    console.error(err)
  }
}
