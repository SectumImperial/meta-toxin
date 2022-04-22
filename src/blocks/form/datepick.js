'use strict'
import './datepick.scss'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'

// const dp = new AirDatepicker(document.querySelector('#booking-out'))
const container = document.querySelector('._datepick-js')
let item = undefined,
  firstItem = undefined,
  secondItem = undefined

if (container) {
  let calConteiner = document.createElement('div')
  calConteiner.className = 'datepick_container'
  container.append(calConteiner)
  let dp = new AirDatepicker('.datepick_container')
  dp.show()

  if (container.classList.contains('_datepick-2')) {
    firstItem = container.querySelector('.form_datepick-start')
    secondItem = container.querySelector('.form_datepick-end')
  }

  if (container.classList.contains('_datepick-1'))
    item = container.querySelector('.form_datepick-single')

  container.addEventListener('click', ({ target }) => {
    if (target.closest('.datepick_container')) return
    calConteiner.classList.toggle('_active')
  })
}
