import './input.scss'
import Inputmask from 'inputmask'

let inputDates = document.querySelectorAll('._dateInput')

if (inputDates) {
  inputDates.forEach((e) => {
    let input = e.querySelector('.input__field')
    Inputmask('datetime', {
      alias: 'datetime',
      inputFormat: 'dd.mm.yyyy',
      placeholder: '__.__.____',
      showMaskOnHover: false,
      showMaskOnFocus: false,
      greedy: false,
    }).mask(input)
  })
}

let inputs = document.querySelectorAll('.input')

inputs.forEach((element) => {
  if (element.querySelector('._datepickItem')) return
  element.addEventListener('click', () => {
    let arrow = element.querySelector('._input_arrow-js')
    if (!arrow) return
    arrow.classList.toggle('input_oppened-js')
  })
})
