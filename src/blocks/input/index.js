import Inputmask from 'inputmask';
import Input from './Input';
import './input.scss';

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

document.querySelectorAll('.input').forEach((e) => new Input(e));
