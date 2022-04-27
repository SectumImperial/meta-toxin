'use strict'
import './datepicker.css'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'

const container = document.querySelector('._datepick-js')

if (container) {
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
}
