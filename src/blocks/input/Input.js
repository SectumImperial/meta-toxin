class Input {
  constructor(element) {
    this.input = element;
    this.init();
  }

  init() {
    this.input.addEventListener('click', this.#handleInputClick.bind(this));
  }

  #handleInputClick() {
    if (this.input.querySelector('input[type="email"]')) return;
    const arrow = this.input.querySelector('._input_arrow');
    if (!arrow) return;
    arrow.classList.toggle('input_opened');
  }
}

export default Input;
