import './input.scss';

import Inputmask from 'inputmask';

const inputDates = document.querySelectorAll('._dateInput');

if (inputDates) {
  inputDates.forEach((e) => {
    Inputmask('datetime', {
      alias: 'datetime',
      inputFormat: 'dd.mm.yyyy',
      placeholder: '__.__.____',
      showMaskOnHover: false,
      showMaskOnFocus: false,
      greedy: false,
    }).mask(e);
  });
}

const inputs = document.querySelectorAll('.input');

inputs.forEach((element) => {
  if (element.querySelector('input[type="email"]')) return;
  element.addEventListener('click', () => {
    const arrow = element.querySelector('._input_arrow-js');
    if (!arrow) return;
    arrow.classList.toggle('input_oppened-js');
  });
});
