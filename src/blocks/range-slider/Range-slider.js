import {
  AMOUNT,
  TOGGLE_MIN,
  TOGGLE_MAX,
  RANGE_PROGRESS,
} from './constants';

class Slider {
  constructor(element) {
    this.slider = element;
    try {
      this.options = JSON.parse(this.slider.dataset.rangeoptions);
    } catch (err) {
      throw new Error('Ошибка в чтении options');
    }

    this.init();
  }

  init() {
    this.#findElems();
    this.#createVars();
    this.#setValues();
    this.#addListeners();
  }

  #findElems() {
    this.field = this.slider.querySelector(`.${AMOUNT}`);
    this.toggleMin = this.slider.querySelector(`.${TOGGLE_MIN}`);
    this.toggleMax = this.slider.querySelector(`.${TOGGLE_MAX}`);
    this.rangeProgress = this.slider.querySelector(`.${RANGE_PROGRESS}`);
  }

  #createVars() {
    this.min = this.options.min ? this.options.min : 0;
    this.max = this.options.max ? this.options.max : 15000;
    this.addedText = this.options.addedText ? this.options.addedText : '';

    this.toggleMin.value = this.options.initialStart
      ? this.options.initialStart
      : this.min;
    this.toggleMax.value = this.options.initialEnd
      ? this.options.initialEnd
      : this.max;

    this.rangeProgress.style.left = `${
      (this.toggleMin.value / this.max) * 100
    }%`;
    this.rangeProgress.style.right = `${
      100 - (this.toggleMax.value / this.max) * 100
    }%`;
  }

  #addListeners() {
    this.toggleMin.addEventListener('input', this.#changeFirstToggle.bind(this));
    this.toggleMax.addEventListener(
      'input',
      this.#changeSecondToggle.bind(this),
    );
  }

  #setValues() {
    const fitstVal = Slider.#performValue(this.toggleMin.value);
    const secondVal = Slider.#performValue(this.toggleMax.value);
    this.field.value = `${fitstVal}${this.addedText} - ${secondVal}${this.addedText}`;
  }

  static #performValue(val) {
    return Number(val).toLocaleString('ru-RU');
  }

  #colorRange() {
    this.rangeProgress.style.left = `${
      (this.toggleMin.value / this.max) * 100
    }%`;
    this.rangeProgress.style.right = `${
      100 - (this.toggleMax.value / this.max) * 100
    }%`;
  }

  #changeFirstToggle() {
    if (
      Number(this.toggleMax.value) - Number(this.toggleMin.value)
      <= this.min
    ) {
      this.toggleMin.value = Number(this.toggleMax.value) - this.min;
    }

    this.#setValues();
    this.#colorRange();

    this.#checkVisibilityToggle();
  }

  #checkVisibilityToggle() {
    if (
      Number(this.toggleMin.value) === this.max
      && Number(this.toggleMax.value) === this.max
    ) {
      this.toggleMax.style.display = 'none';
    } else {
      this.toggleMax.style.display = 'block';
    }
  }

  #changeSecondToggle() {
    if (
      Number(this.toggleMax.value) - Number(this.toggleMin.value)
      <= this.min
    ) {
      this.toggleMax.value = Number(this.toggleMin.value) + this.min;
    }

    this.#setValues();
    this.#colorRange();
  }
}

export default Slider;
