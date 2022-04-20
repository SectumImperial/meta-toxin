import './datepicker.scss'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'

let dp = new AirDatepicker(document.querySelector('#booking-out'))
console.log(dp.focusDate)
