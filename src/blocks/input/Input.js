import Inputmask from 'inputmask';

class Input {
  constructor(element) {
    this.input = element;
    this.handleInputClick = this.handleInputClick.bind(this);
    this.init();
  }

  init() {
    this.input.addEventListener('click', this.handleInputClick);
    this.#addMask();
    return this;
  }

  handleInputClick() {
    if (this.input.querySelector('input[type="email"]')) return;
    const arrow = this.input.querySelector('._input_arrow');
    if (arrow === undefined && arrow === null) return;
    arrow.classList.toggle('input_opened');
  }

  #addMask() {
    const field = this.input.querySelector('.input__field_masked');
    if (field !== null) {
      Inputmask('datetime', {
        alias: 'datetime',
        inputFormat: 'dd.mm.yyyy',
        placeholder: '__.__.____',
        showMaskOnHover: false,
        showMaskOnFocus: false,
        greedy: false,
      }).mask(field);
    }
  }
}

export default Input;
