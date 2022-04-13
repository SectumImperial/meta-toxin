import './input.scss'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'

const dateElems = document.querySelectorAll('.datepicker')
dateElems.forEach((e) => {
  let dp = new AirDatepicker(e)
})
