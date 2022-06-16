import './input.scss'
import Inputmask from 'inputmask'

let inputDates = document.querySelectorAll('._dateInput')

if (inputDates) {
  inputDates.forEach((e) => {
    Inputmask('datetime', {
      alias: 'datetime',
      inputFormat: 'dd.mm.yyyy',
      placeholder: '__.__.____',
      showMaskOnHover: false,
      showMaskOnFocus: false,
      greedy: false,
    }).mask(e)
  })
}
