import { v4 as uuidv4 } from 'uuid';

import {
  CHART,
  LEGEND,
  SVG,
  ITEM,
  UNIT,
} from './constants';

import {
  sumCount,
  addText,
} from './helpers';

class Canvas {
  constructor(element) {
    this.canvas = element;
    try {
      this.inputOptions = JSON.parse(this.canvas.dataset.canvas);
    } catch (err) {
      console.error('Error in the options', err);
    }

    this.handleItemOver = this.handleItemOver.bind(this);
    this.handleItemOut = this.handleItemOut.bind(this);

    this.init();
  }

  init() {
    this.options = this.#performOptions();
    this.allCounts = sumCount(this.options);
    this.dashoffsets = [];
    this.svgBlock = this.canvas.querySelector(`.${CHART}`);
    this.legendBlock = this.canvas.querySelector(`.${LEGEND}`);

    this.defs = this.#createDefs();
    this.circles = this.#createCircles();
    this.text = this.#createText();
    this.svgTmp = this.#createSvg();
    this.#addSvg();

    this.chart = this.canvas.querySelector(`.${SVG}`);
    addText(this.chart, this.text);
    this.list = this.#createList();
    this.items = this.list.querySelectorAll(`.${ITEM}`);
    this.legendBlock.append(this.list);

    this.circles = this.canvas.querySelectorAll(`.${UNIT}`);
    this.#addListeners();

    return this;
  }

  static addIdForOptions(items) {
    let options = [];
    items.forEach((option) => {
      options = [...options, { ...option, id: uuidv4() }];
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

  static createURL({ id }) {
    return `stroke="url(#${id})"`;
  }

  static createDashOffset(dashoffsetVal = 0) {
    let strokeDashoffset = dashoffsetVal;
    if (dashoffsetVal !== 0) strokeDashoffset *= -1;
    return `stroke-dashoffset="${strokeDashoffset}"`;
  }

  #addListeners() {
    this.items.forEach((item) => {
      item.addEventListener('mouseover', this.handleItemOver);
      item.addEventListener('mouseout', this.handleItemOut);
    });

    this.circles.forEach((circle) => {
      circle.addEventListener('mouseover', this.handleItemOver);
      circle.addEventListener('mouseout', this.handleItemOut);
      circle.addEventListener('focus', this.handleItemOver);
      circle.addEventListener('blur', this.handleItemOut);
    });

    return this;
  }

  handleItemOut() {
    this.#deleteText();
    this.text = this.#createText();
    addText(this.chart, this.text);
    this.#resetLine();
    this.#resetHoverText();
    return this;
  }

  handleItemOver({ target }) {
    const { line } = target.dataset;

    this.options.forEach(({ count, stopFirst, grade = 'default' }) => {
      if (grade === line) {
        this.text = this.#createText(stopFirst, count);
        this.#deleteText();
        addText(this.chart, this.text);

        if (target.classList.contains(ITEM)) this.#boldLine(grade);
        if (target.classList.contains(UNIT)) this.#hoverText(grade);
      }
    });
    return this;
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
        if (Number.isNaN(key)) console.error('Error in the number of ratings');
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
        filteredOptions = [...filteredOptions.slice(0, index),
          unitedItem, ...filteredOptions.slice(index)];
      }
    });

    return filteredOptions;
  }

  #uniteItems(grade) {
    if (!grade) console.error('Cannot unite empty items');
    const sameItems = this.inputOptions.filter((option) => option.grade === grade);
    const sumCounts = sameItems.reduce((p, c) => p.count + c.count);

    let collectOptions;
    sameItems.forEach((object) => {
      collectOptions = { ...object, ...collectOptions };
    });

    const newItem = { ...collectOptions, count: sumCounts };
    return newItem;
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
    return this;
  }

  #createDefs() {
    let items = '';
    this.options.forEach((option) => {
      items += Canvas.createDef(option);
    });
    if (items.length === 0) console.error('No options for the defs in the Canvas class');

    const defs = `<defs>${items}</defs>`;
    return defs;
  }

  #createCircles() {
    let circles = [];
    this.options.forEach((option) => {
      circles = [...circles, this.#createCircle(option)];
    });

    return circles;
  }

  #createCircle(option) {
    const dash = Canvas.computeDash(option, this.allCounts);
    const dashoffsetVal = this.dashoffsets.reduce(
      (curr, prev) => curr + prev,
      0,
    );
    this.dashoffsets = [...this.dashoffsets, dash];

    const dasharray = Canvas.createDash(dash);
    const url = Canvas.createURL(option);
    const dashoffset = Canvas.createDashOffset(dashoffsetVal);
    const className = option.grade ? `${UNIT}_${option.grade}` : `${UNIT}_default`;
    const circle = `<circle class="${UNIT} ${className}" data-line="${option.grade}" 
    r="15.9" cx="50%" cy="50%" ${url} ${dasharray} ${dashoffset} tabindex="0"></circle>`;
    return circle;
  }

  #createText(fill = '#000000', count = this.allCounts) {
    const textNum = `<text text-anchor="middle" class="canvas__number" x="50%" y="48%" fill="${fill}">${count}</text>`;
    const description = `<text text-anchor="middle" class="canvas__description" x="50%" y="65%" fill="${fill}">Голосов</text>`;
    const group = `<g class="canvas__text-group" fill="${fill}">${textNum}${description}</g>`;
    return group;
  }

  #createList() {
    const ul = Canvas.createUl();
    let items = [];
    this.options.forEach((option) => {
      items = [...items, Canvas.createLi(option)];
    });
    items.forEach((e) => {
      ul.append(e);
    });

    return ul;
  }

  #deleteText() {
    const text = this.canvas.querySelector('.canvas__text-group');
    if (text !== '') text.remove();
    return this;
  }

  #boldLine(grade) {
    const circleLine = this.canvas.querySelector(`.${UNIT}_${grade}`);
    if (circleLine !== undefined && circleLine !== null) circleLine.classList.add(`${UNIT}_hovered`);
    return this;
  }

  #hoverText(grade) {
    const item = this.canvas.querySelector(`.${ITEM}_${grade}`);
    if (item !== undefined && item !== null) item.classList.add(`${ITEM}_hovered`);
    return this;
  }

  #resetLine() {
    const hoveredLine = this.canvas.querySelector(`.${UNIT}_hovered`);
    if (hoveredLine !== undefined && hoveredLine !== null) hoveredLine.classList.remove(`${UNIT}_hovered`);
    return this;
  }

  #resetHoverText() {
    const item = this.canvas.querySelector(`.${ITEM}_hovered`);
    if (item !== undefined && item !== null) item.classList.remove(`${ITEM}_hovered`);
    return this;
  }
}

export default Canvas;
