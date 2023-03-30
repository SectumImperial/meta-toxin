import {
  AMOUNT,
  SLIDER_TOGGLE,
  SLIDER_TOGGLE_MIN,
  SLIDER_TOGGLE_MAX,
  RANGE_PROGRESS,
  SLIDER,
} from './constants';

class Slider {
  constructor(element) {
    this.slider = element;
    try {
      this.options = JSON.parse(this.slider.dataset.rangeoptions);
    } catch (err) {
      console.error('Error in reading options');
    }

    this.handleToggleMouseDown = this.handleToggleMouseDown.bind(this);
    this.handleToggleTouchStart = this.handleToggleTouchStart.bind(this);
    this.handleToggleKeyDown = this.handleToggleKeyDown.bind(this);
    Slider.handleDragStartEvent = Slider.handleDragStartEvent.bind(this);

    this.init();
  }

  init() {
    this.#findElements();
    this.#createVars();
    this.#validateRange();
    this.#validateStep();
    this.#checkValues();
    this.#checkPercents();
    this.#setProgress();
    this.#addListeners();
    this.#setTogglesState();
    return this;
  }

  static formatValue(value) {
    const result = new Intl.NumberFormat('ru-RU').format(value);
    return result;
  }

  static performMoveToPercent(data = {}) {
    const {
      coordsMove, scaleSize,
    } = data;

    const percent = scaleSize / 100;
    const percentMove = Number((coordsMove / percent).toFixed(2));
    if (percentMove < 0) return 0;
    if (percentMove > 100) return 100;

    return percentMove;
  }

  #addListeners() {
    this.toggles.forEach((e) => {
      e.addEventListener('mousedown', this.handleToggleMouseDown);
      e.addEventListener('dragstart', Slider.handleDragStartEvent);
      e.addEventListener(
        'touchstart',
        this.handleToggleTouchStart,
        { passive: true },
      );
      e.addEventListener('keydown', this.handleToggleKeyDown);
    });
    return this;
  }

  static handleDragStartEvent() {
    return false;
  }

  handleToggleMouseDown(e) {
    e.preventDefault();
    this.#performStartMove(e);
    return this;
  }

  handleToggleTouchStart(e) {
    this.#performStartTouch(e);
    return this;
  }

  handleToggleKeyDown(e) {
    const { key, target } = e;
    if (key === 'ArrowLeft') {
      e.preventDefault();
      this.#performKeyDown('decrement', target);
    }

    if (key === 'ArrowRight') {
      e.preventDefault();
      this.#performKeyDown('increment', target);
    }
    return this;
  }

  #findElements() {
    this.field = this.slider.querySelector(`.${AMOUNT}`);
    this.toggles = this.slider.querySelectorAll(`.${SLIDER_TOGGLE}`);
    this.sliderTrack = this.slider.querySelector(`.${SLIDER}`);
    this.toggleMin = this.slider.querySelector(`.${SLIDER_TOGGLE_MIN}`);
    this.toggleMax = this.slider.querySelector(`.${SLIDER_TOGGLE_MAX}`);
    this.rangeProgress = this.slider.querySelector(`.${RANGE_PROGRESS}`);
    return this;
  }

  #createVars() {
    this.min = this.options.min ? this.options.min : 0;
    this.max = this.options.max ? this.options.max : 15000;
    this.step = this.options.step ? this.options.step : 1;
    if (Number.isNaN(this.step)) this.step = 1;
    this.valueFrom = this.options.initialStart ? this.options.initialStart : this.min;
    this.valueTo = this.options.initialEnd ? this.options.initialEnd : this.max;
    this.addedText = this.options.addedText ? this.options.addedText : '';
    this.stepPercent = Number((this.step / this.#findValPercent()));

    this.togglePercentFrom = 0;
    this.togglePercentTo = 100;
    return this;
  }

  #validateRange() {
    if (Number.isNaN(this.min)) this.min = 0;
    if (Number.isNaN(this.max)) this.max = 15000;
    if (this.min === this.max) {
      this.max = this.min + this.step;
    }
    if (this.min > this.max) {
      [this.min, this.max] = [this.max, this.min];
    }
    return this;
  }

  #validateStep() {
    const allRange = this.#findRange();

    if (this.step > allRange) {
      this.step = allRange;
    }
    if (this.step === undefined && this.step === null) this.step = 1;
    return this;
  }

  #checkValues() {
    this.valueFrom = this.#checkValue(this.valueFrom);

    if (this.isRange) {
      this.valueTo = this.checkValue(this.valueTo);
    }

    if (this.valueTo !== undefined && this.valueFrom > this.valueTo && this.isRange) {
      [this.valueFrom, this.valueTo] = [this.valueTo, this.valueFrom];
    }
    return this;
  }

  #checkValue(value) {
    let result = value;
    if (Number.isNaN(result)) result = 0;
    if (result === this.max) {
      result = this.max;
      return result;
    }

    if (result % this.step !== 0 && result !== this.min) {
      const countStep = Math.round((result - this.min) / this.step);
      const countVal = this.min + (this.step * countStep);
      result = countVal;
    }

    if (result > this.max) {
      result = this.max;
    }

    if (result < this.min) {
      result = this.min;
    }

    return result;
  }

  #performStartMove(e) {
    const { target } = e;
    const shiftX = e.clientX
    - (e.target.getBoundingClientRect().left + (e.target.getBoundingClientRect().width / 2));

    const onMouseMove = (event) => {
      const coordsMove = event.clientX - shiftX - this.slider.getBoundingClientRect().left;
      const percent = Slider.performMoveToPercent({
        coordsMove,
        scaleSize: this.sliderTrack.offsetWidth,
      });

      this.#performMove(percent, target);
    };

    const onMouseUp = () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return this;
  }

  #performStartTouch(e) {
    const { target } = e;
    const moved = e.touches.item(0).clientX - target.getBoundingClientRect().left;
    const handleToggleTouchMove = (event) => {
      e.stopImmediatePropagation();
      const sliderSize = this.slider.getBoundingClientRect().left;
      const coordsMove = event.touches.item(0).clientX - moved - sliderSize;
      const percent = Slider.performMoveToPercent({
        coordsMove,
        scaleSize: this.sliderTrack.offsetWidth,
      });

      this.#performMove(percent, target);
    };

    const handleToggleTouchEnd = () => {
      document.removeEventListener('touchmove', handleToggleTouchMove);
      document.removeEventListener('touchend', handleToggleTouchEnd);
    };

    document.addEventListener('touchmove', handleToggleTouchMove);
    document.addEventListener('touchend', handleToggleTouchEnd);
    return this;
  }

  #performKeyDown(action, target) {
    const togglePercent = target.classList.contains(SLIDER_TOGGLE_MIN) ? 'togglePercentFrom' : 'togglePercentTo';
    if (action === 'decrement') {
      const percentMove = this[togglePercent] - this.stepPercent < 0
        ? 0 : this[togglePercent] - this.stepPercent;
      this.#performMove(percentMove, target);
    }

    if (action === 'increment') {
      const percentMove = this[togglePercent] + this.stepPercent > 100
        ? 100 : this[togglePercent] + this.stepPercent;
      this.#performMove(percentMove, target);
    }
    return this;
  }

  #performMove(percentMove, toggle) {
    const nearestPrevCountStep = Math.floor(percentMove / this.stepPercent);
    const nearestNextCountStep = Math.ceil(percentMove / this.stepPercent);

    const prevStep = this.min + (this.step * nearestPrevCountStep);
    const nextStep = this.min + (this.step * nearestNextCountStep);

    const prevPercent = this.stepPercent * nearestPrevCountStep;
    const nextPercent = this.stepPercent * nearestNextCountStep;

    const halfStep = Number((this.stepPercent / 2).toFixed(3));
    const halfMove = Number((percentMove % this.stepPercent).toFixed(3));

    let value;
    let percent;

    if (halfMove < halfStep) {
      value = prevStep;
      percent = prevPercent;
    } else {
      value = nextStep;
      percent = nextPercent;
    }

    const allSteps = Math.ceil((this.max - this.min) / this.step);
    const beforeEndPercent = this.stepPercent * (allSteps - 1);

    if (percentMove === 100 || 100 - ((100 - beforeEndPercent) / 2) < percentMove) {
      value = this.max;
      percent = 100;
    }
    if (percent === undefined) percent = this.stepPercent * nearestPrevCountStep;

    percent = Number(percent.toFixed(3));
    const toggleID = toggle.classList.contains(SLIDER_TOGGLE_MIN) ? 'min' : 'max';
    this.#updatePosition({
      value,
      toggle: toggleID,
      percent,
    });
    return this;
  }

  #updatePosition(values = {}) {
    const {
      value,
      toggle,
      percent,
    } = values;

    if (toggle === 'min') {
      this.#handleMoveFrom({
        value,
        toggle,
        percent,
      });
    }

    if (toggle === 'max') {
      this.#handleMoveTo({
        value,
        toggle,
        percent,
      });
    }
    return this;
  }

  #handleMoveTo(values) {
    const {
      value,
      toggle,
      percent,
    } = values;

    this.#updateMoved(value, percent, toggle);

    const isTheSamePos = this.#isValTheSamePos({
      value,
      toggle,
      percent,
    });

    if (isTheSamePos) {
      this.#updateMoved(this.valueFrom, this.togglePercentFrom, toggle);
    } else {
      this.#updateMoved(value, percent, toggle);
    }
    return this;
  }

  #handleMoveFrom(values) {
    const {
      value,
      toggle,
      percent,
    } = values;

    const isTheSamePos = this.#isValTheSamePos({
      value,
      toggle,
      percent,
    });

    if (isTheSamePos) {
      this.#updateMoved(this.valueTo, this.togglePercentTo, toggle);
    } else {
      this.#updateMoved(value, percent, toggle);
    }
    return this;
  }

  #findValPercent() {
    const range = this.#findRange();
    const percent = range / 100;
    return percent;
  }

  #findRange() {
    const range = this.max - this.min;
    return range;
  }

  #checkPercents() {
    this.togglePercentFrom = this.#checkPercent('valueFrom');
    this.togglePercentTo = this.#checkPercent('valueTo');
    return this;
  }

  #checkPercent(value = 'valueFrom') {
    const valOfRange = this[value] - this.min;
    const currentPercent = Number((valOfRange / (this.#findRange() / 100)).toFixed(3));
    return Number(currentPercent);
  }

  #isValTheSamePos(values = {}) {
    const {
      value,
      toggle,
      percent,
    } = values;
    const secondTogglePosition = toggle === 'min' ? this.togglePercentTo : this.togglePercentFrom;
    const secondToggleValue = toggle === 'min' ? this.valueTo : this.valueFrom;

    if (toggle === 'min'
    && Number(value) >= Number(secondToggleValue)
    && Number(percent) >= Number(secondTogglePosition)) {
      return true;
    }

    if (toggle === 'max'
    && Number(value) <= Number(secondToggleValue)
    && Number(percent) <= Number(secondTogglePosition)) {
      return true;
    }

    return false;
  }

  #updateMoved(val, percent, toggle) {
    if (Number.isNaN(val) || percent === undefined) console.error('Something wrong with setting new values');
    this.#setToggleState({
      toggle,
      val,
      percent,
    });

    this.#setProgress();
    return this;
  }

  #setTogglesState() {
    this.#setToggleState({
      toggle: 'min',
      val: this.valueFrom,
      percent: this.togglePercentFrom,
    });
    this.#setToggleState({
      toggle: 'max',
      val: this.valueTo,
      percent: this.togglePercentTo,
    });
    return this;
  }

  #setToggleState(state = {}) {
    const {
      toggle,
      val,
      percent,
    } = state;

    if (toggle === 'min') {
      this.valueFrom = val;
      this.togglePercentFrom = percent;
      this.toggleMin.style.left = `${percent}%`;
    }

    if (toggle === 'max') {
      this.valueTo = val;
      this.togglePercentTo = percent;
      this.toggleMax.style.left = `${percent}%`;
    }

    const firstValue = Slider.formatValue(this.valueFrom);
    const secondValue = Slider.formatValue(this.valueTo);

    this.field.value = `${firstValue}${this.addedText} - ${secondValue}${this.addedText}`;

    this.#checkZIndex();
    return this;
  }

  #setProgress() {
    const widthProgress = this.togglePercentTo ? this.togglePercentTo - this.togglePercentFrom : 0;
    const positionStart = this.togglePercentFrom;
    const positionEnd = widthProgress;

    this.rangeProgress.style.left = `${positionStart}%`;
    this.rangeProgress.style.width = `${positionEnd}%`;
    return this;
  }

  #checkZIndex() {
    if (this.togglePercentTo === 100 && this.togglePercentFrom === 100) {
      this.toggleMin.style.zIndex = '10';
      this.toggleMax.style.zIndex = '5';
    }

    if (this.togglePercentTo === 0 && this.togglePercentFrom === 0) {
      this.toggleMin.style.zIndex = '5';
      this.toggleMax.style.zIndex = '10';
    }
    return this;
  }
}

export default Slider;
