import { v4 as uuidv4 } from 'uuid';
import {
  CHART,
  LEGEND,
  SVG,
  ITEM,
  UNIT,
} from './constants';

class Canvas {
  constructor(element) {
    this.canvas = element;
    try {
      this.inputOptions = JSON.parse(this.canvas.dataset.canvas);
    } catch (err) {
      throw new Error('Ошибка в опциях', err);
    }

    this.init();
  }

  init() {
    this.options = this.#performOptions();
    this.allCounts = this.#sumCount();
    this.dashoffsets = [];
    this.svgBlock = this.canvas.querySelector(`.${CHART}`);
    this.legendBlock = this.canvas.querySelector(`.${LEGEND}`);

    this.defs = this.#createDefs();
    this.circles = this.#createCircles();
    this.text = this.#createText();
    this.svgTmp = this.#createSvg();
    this.#addSvg();

    this.chart = this.canvas.querySelector(`.${SVG}`);
    this.#addText();
    this.list = this.#createList();
    this.items = this.list.querySelectorAll(`.${ITEM}`);
    this.legendBlock.append(this.list);

    this.circles = this.canvas.querySelectorAll(`.${UNIT}`);
    this.#addListeners();
  }

  #addListeners() {
    this.items.forEach((item) => {
      item.addEventListener('mouseover', this.#handleItemOver.bind(this));
      item.addEventListener('mouseout', this.#handleItemOut.bind(this));
    });

    this.circles.forEach((circle) => {
      circle.addEventListener('mouseover', this.#handleItemOver.bind(this));
      circle.addEventListener('mouseout', this.#handleItemOut.bind(this));
      circle.addEventListener('focus', this.#handleItemOver.bind(this));
      circle.addEventListener('blur', this.#handleItemOut.bind(this));
    });
  }

  #performOptions() {
    const uniqueItems = this.#makeGradeUnique();
    const options = Canvas.addIdForOptions(uniqueItems);
    return options;
  }

  #makeGradeUnique() {
    const grades = new Map();
    let filteredOptions = [...this.inputOptions];

    this.inputOptions.forEach(({ grade }) => {
      if (grades.has(grade)) {
        const key = Number(grades.get(grade)) + 1;
        if (Number.isNaN(key)) throw new Error('Ошибка в количестве оценок');
        grades.set(grade, key);
      } else {
        grades.set(grade, 1);
      }
    });

    grades.forEach((key, grade) => {
      if (key > 1) {
        const unitedItem = this.#uniteItems(grade);
        const index = filteredOptions.findIndex((e) => e.grade === grade);
        filteredOptions = filteredOptions.filter((option) => option.grade !== grade);
        filteredOptions.splice(index, 0, unitedItem);
      }
    });
    return filteredOptions;
  }

  #uniteItems(grade) {
    if (!grade) throw new Error('Cannot unite empty items');
    const sameItems = this.inputOptions.filter((option) => option.grade === grade);
    const sumCounts = sameItems.reduce((p, c) => p.count + c.count, 0);
    const newItem = Object.assign(...sameItems, { count: sumCounts });
    return newItem;
  }

  #sumCount() {
    let sum = 0;
    this.options.forEach((option) => {
      if (!Number.isNaN(option.count)) sum += option.count;
      if (Number.isNaN(option.count)) sum += 0;
    });

    if (Number.isNaN(sum)) {
      throw new Error('Ошибка в подсчёте суммы голосов Canvas');
    }
    return sum;
  }

  #createSvg() {
    const svgTemp = `<svg class="${SVG}" width="120" height="121" viewBox="0 0 33 32">
    ${this.defs}
    ${this.circles.join('')}
    </svg>`;
    return svgTemp;
  }

  #addSvg() {
    this.svgBlock.insertAdjacentHTML('beforeend', this.svgTmp);
  }

  #createDefs() {
    let items = '';
    this.options.forEach((option) => {
      items += Canvas.createDef(option);
    });
    if (items.length === 0) throw new Error('Нет опций для defs');

    const defs = `<defs>${items}</defs>`;
    return defs;
  }

  #createCircles() {
    const circles = [];
    this.options.forEach((option) => {
      circles.push(this.#createCircle(option));
    });

    return circles;
  }

  #createCircle(option) {
    const dash = Canvas.computeDash(option, this.allCounts);
    const dashoffsetVal = this.dashoffsets.reduce(
      (curr, prev) => curr + prev,
      0,
    );
    this.dashoffsets.push(dash);

    const dasharray = Canvas.createDash(dash);
    const url = Canvas.createUrl(option);
    const dashoffset = Canvas.createDashOffset(dashoffsetVal);
    const className = option.grade ? `${UNIT}_${option.grade}` : `${UNIT}_default`;
    const circle = `<circle class="${UNIT} ${className}" data-line="${option.grade}" 
    r="15.9" cx="50%" cy="50%" ${url} ${dasharray} ${dashoffset} tabindex="0"></circle>`;
    return circle;
  }

  #createText(fill = '#000000', count = this.allCounts) {
    const textNum = `<text text-anchor="middle" class="canvas__number" x="50%" y="48%" fill="${fill}">${count}</text>`;
    const description = `<text text-anchor="middle" class="canvas__descr" x="50%" y="65%" fill="${fill}">Голосов</text>`;
    const group = `<g class="canvas__text-group" fill="${fill}">${textNum}${description}</g>`;
    return group;
  }

  #createList() {
    const ul = Canvas.createUl();
    const items = [];
    this.options.forEach((option) => {
      items.push(Canvas.createLi(option));
    });
    items.forEach((e) => {
      ul.append(e);
    });

    return ul;
  }

  #addText() {
    this.chart.insertAdjacentHTML('beforeend', this.text);
  }

  #deleteText() {
    const text = this.canvas.querySelector('.canvas__text-group');
    if (text !== '') text.remove();
  }

  #handleItemOver({ target }) {
    const { line } = target.dataset;

    this.options.forEach(({ count, stopFirst, grade = 'default' }) => {
      if (grade === line) {
        this.text = this.#createText(stopFirst, count);
        this.#deleteText();
        this.#addText();

        if (target.classList.contains(ITEM)) this.#boldLine(grade);
        if (target.classList.contains(UNIT)) this.#hoverText(grade);
      }
    });
  }

  #handleItemOut() {
    this.#deleteText();
    this.text = this.#createText();
    this.#addText();
    this.#resetLine();
    this.#resetHoverText();
  }

  #boldLine(grade) {
    const circleLine = this.canvas.querySelector(`.${UNIT}_${grade}`);
    if (circleLine) circleLine.classList.add(`${UNIT}_hovered`);
  }

  #hoverText(grade) {
    const item = this.canvas.querySelector(`.${ITEM}_${grade}`);
    if (item) item.classList.add(`${ITEM}_hovered`);
  }

  #resetLine() {
    const hoveredLine = this.canvas.querySelector(`.${UNIT}_hovered`);
    if (hoveredLine) hoveredLine.classList.remove(`${UNIT}_hovered`);
  }

  #resetHoverText() {
    const item = this.canvas.querySelector(`.${ITEM}_hovered`);
    if (item) item.classList.remove(`${ITEM}_hovered`);
  }

  static addIdForOptions(items) {
    const options = [];
    items.forEach((option) => {
      options.push({ ...option, id: uuidv4() });
    });
    return options;
  }

  static createDef({
    id,
    stopFirst = '#6b0000',
    stopSecond = '#1a0000',
  }) {
    return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${stopFirst}"/>
      <stop offset="100%" stop-color="${stopSecond}"/>
    </linearGradient>`;
  }

  static createUl() {
    const ul = document.createElement('ul');
    ul.className = 'canvas__items';
    return ul;
  }

  static createLi({
    grade = 'default',
    name = 'Мёртвые голоса',
    stopFirst = '#6b0000',
    stopSecond = '#1a0000',
  }) {
    const li = document.createElement('li');
    const className = `${ITEM} ${ITEM}_${grade}`;
    li.dataset.line = grade;
    li.className = className;
    li.innerText = name;

    const mark = document.createElement('div');
    mark.className = `${ITEM}-mark ${ITEM}-mark_${grade}`;
    mark.style.width = '10px';
    mark.style.height = '10px';
    mark.style.background = `linear-gradient(${stopFirst}, ${stopSecond})`;
    mark.style.borderRadius = '50%';

    li.append(mark);

    return li;
  }

  static computeDash({ count = 0 }, allCounts) {
    const dash = (count / allCounts) * 100;
    return dash;
  }

  static createDash(dash = 0) {
    let strokeDasharray = dash;
    if (dash >= 1) strokeDasharray -= 1;
    const dasharray = `stroke-dasharray="${strokeDasharray} 100"`;
    return dasharray;
  }

  static createUrl({ id }) {
    return `stroke="url(#${id})"`;
  }

  static createDashOffset(dashoffsetVal = 0) {
    let strokeDashoffset = dashoffsetVal;
    if (dashoffsetVal !== 0) strokeDashoffset *= -1;
    return `stroke-dashoffset="${strokeDashoffset}"`;
  }
}

export default Canvas;
