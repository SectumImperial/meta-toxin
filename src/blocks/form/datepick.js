'use strict'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'

// const dp = new AirDatepicker(document.querySelector('#booking-out'))
const container = document.querySelector('._datepick-js')
let item = undefined,
  firstItem = undefined,
  secondItem = undefined

const inputItems = document.querySelectorAll('._datepickItem')

if (container.classList.contains('_datepick-2')) {
  firstItem = container.querySelector('.form_datepick-start')
  secondItem = container.querySelector('.form_datepick-end')
}

if (container.classList.contains('_datepick-1'))
  item = container.querySelector('.form_datepick-single')

// container.addEventListener('click', ({ target }) => {
// })
