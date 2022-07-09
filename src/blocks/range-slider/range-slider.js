class Slider {
  constructor(element) {
    this.slider = element;

    this.options;
    try {
      this.options = JSON.parse(this.slider.dataset.rangeoptions);
    } catch (err) {
      throw new Error('Ошибка в чтении options');
    }

    this.init();
  }

  init() {
    this.field = this.slider.querySelector('.range-slider__amount');
    this.toggleOne = this.slider.querySelector('.range-slider__input_min');
    this.toggleTwo = this.slider.querySelector('.range-slider__input_max');
    this.rangeProgress = this.slider.querySelector('.range-slider__progress');

    this.min = this.options.min ? this.options.min : 0;
    this.max = this.options.max ? this.options.max : 15000;
    this.addedText = this.options.addedText ? this.options.addedText : '';

    this.toggleOne.value = this.options.initialStart
      ? this.options.initialStart
      : this.min;
    this.toggleTwo.value = this.options.initialEnd
      ? this.options.initialEnd
      : this.max;

    this.rangeProgress.style.left = `${
      (this.toggleOne.value / this.max) * 100
    }%`;
    this.rangeProgress.style.right = `${
      100 - (this.toggleTwo.value / this.max) * 100
    }%`;

    this.setValues();
    this.addListeners();
  }

  addListeners() {
    this.toggleOne.addEventListener('input', this.changeFirstToggle.bind(this));
    this.toggleTwo.addEventListener(
      'input',
      this.changeSecondToggle.bind(this),
    );
  }

  setValues() {
    const fitstVal = this.performValue(this.toggleOne.value);
    const secondVal = this.performValue(this.toggleTwo.value);
    this.field.value = `${fitstVal}${this.addedText} - ${secondVal}${this.addedText}`;
  }

  performValue(val) {
    const [_, num, suffix] = val.match(/^(.*?)((?:[,.]\d+)?|)$/);
    return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`;
  }

  colorRange() {
    this.rangeProgress.style.left = `${
      (this.toggleOne.value / this.max) * 100
    }%`;
    this.rangeProgress.style.right = `${
      100 - (this.toggleTwo.value / this.max) * 100
    }%`;
  }

  changeFirstToggle() {
    if (
      Number(this.toggleTwo.value) - Number(this.toggleOne.value)
      <= this.min
    ) {
      this.toggleOne.value = Number(this.toggleTwo.value) - this.min;
    }

    this.setValues();
    this.colorRange();

    if (
      Number(this.toggleOne.value) === this.max
      && Number(this.toggleTwo.value) === this.max
    ) {
      this.toggleTwo.style.display = 'none';
    } else {
      this.toggleTwo.style.display = 'block';
    }
  }

  changeSecondToggle() {
    if (
      Number(this.toggleTwo.value) - Number(this.toggleOne.value)
      <= this.min
    ) {
      this.toggleTwo.value = Number(this.toggleOne.value) + this.min;
    }

    this.setValues();
    this.colorRange();
  }
}

export default Slider;
