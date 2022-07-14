/* eslint-disable linebreak-style */
class Input {
  constructor(element) {
    this.input = element;
    this.init();
  }

  init() {
    this.input.addEventListener('click', this.toggleArrow.bind(this));
  }

  toggleArrow() {
    if (this.input.querySelector('input[type="email"]')) return;
    const arrow = this.input.querySelector('._input_arrow-js');
    if (!arrow) return;
    arrow.classList.toggle('input_oppened-js');
  }
}

export default Input;
