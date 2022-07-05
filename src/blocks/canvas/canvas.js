import './canvas.scss'

class Canvas {
  constructor(element) {
    this.canvas = element

    this.options
    try {
      this.options = JSON.parse(this.canvas.dataset.canvas)
    } catch (err) {
      throw new Error('Ошибка в опциях', err)
    }

    this.init()
  }

  init() {
    this.allCounts = this.sumCount()
    this.dashoffsets = []

    this.svgBlock = this.canvas.querySelector('.canvas__chart')
    this.legendBlock = this.canvas.querySelector('.canvas__legend')

    this.defs = this.createDefs()
    this.circles = this.createCircles()
    this.text = this.createText()
    this.svgTmp = this.createSvg()

    this.addSvg()
    this.chart = document.querySelector('.canvas__svg')
    this.addText()

    this.list = this.createList()
    this.items = this.list.querySelectorAll('.canvas__item')
    this.legendBlock.append(this.list)

    this.addListeners()
  }

  addListeners() {
    this.items.forEach((item) => {
      item.addEventListener('mouseover', this.performText.bind(this))
      item.addEventListener('mouseout', this.resetText.bind(this))
    })
  }

  sumCount() {
    let sum = 0
    for (let option of this.options) {
      if (option.count) sum += option.count
      if (!option.count) sum += 0
    }

    if (isNaN(sum)) throw new Error('Ошибка в подсчёте суммы голосов')
    return sum
  }

  createSvg() {
    let svgTemp = `<svg class="canvas__svg" width="120" height="120" viewBox="0 0 35 30">
    ${this.defs}
    ${this.circles.join('')}
    </svg>`
    return svgTemp
  }

  addSvg() {
    this.svgBlock.insertAdjacentHTML('beforeend', this.svgTmp)
  }

  createDefs() {
    let items = ''
    this.options.forEach((option) => {
      items += this.createDef(option)
    })
    if (items.length === 0) throw new Error('Нет опций для defs')

    let defs = `<defs>${items}</defs>`
    return defs
  }

  createDef({ id = 'default', stopFirst = '#6b0000', stopSecond = '#1a0000' }) {
    return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${stopFirst}"/><stop offset="100%" stop-color="${stopSecond}"/></linearGradient>`
  }

  createCircles() {
    let circles = []
    this.options.forEach((option) => {
      circles.push(this.createCircle(option))
    })

    return circles
  }

  createCircle(option) {
    // create dashoffsets
    let dash = this.computeDash(option, this.allCounts)
    let dashoffsetVal = this.dashoffsets.reduce((curr, prev) => curr + prev, 0)
    this.dashoffsets.push(dash)

    // create rest params
    let dasharray = this.createDash(dash)
    let url = this.createUrl(option)
    let dashoffset = this.createDashOffset(dashoffsetVal)

    let className = option.id
      ? `canvas__unit_${option.id}`
      : 'canvas__unit_default'

    let circle = `<circle class='canvas__unit ${className}' r="15.9" cx="50%" cy="50%" ${url} ${dasharray} ${dashoffset}></circle>`
    return circle
  }

  computeDash({ count = 0 }, allCounts) {
    let dash = (count / allCounts) * 100
    return dash
  }

  createDash(dash) {
    if (dash !== 0) dash--
    let dasharray = `stroke-dasharray="${dash} 100"`
    return dasharray
  }

  createUrl({ id = 'default' }) {
    return `stroke="url(#${id})"`
  }

  createDashOffset(dashoffsetVal = 0) {
    if (dashoffsetVal !== 0) dashoffsetVal *= -1
    return `stroke-dashoffset="${dashoffsetVal}"`
  }

  // Creat the text
  createText(fill = '#1F2041', count = this.allCounts) {
    let textNum = `<text text-anchor="middle" class="canvas__number" x="50%" y="48%" fill="${fill}">${count}</text>`
    let description = `<text text-anchor="middle" class="canvas__descr" x="50%" y="65%" fill="${fill}">Голосов</text>`
    let group = `<g class="canvas__text-group" fill="${fill}">${textNum}${description}</g>`
    return group
  }

  // create the list
  createList() {
    let ul = this.createUl()
    let items = []
    this.options.forEach((option) => {
      items.push(this.createLi(option))
    })
    items.forEach((e) => {
      ul.append(e)
    })

    return ul
  }

  createUl() {
    let ul = document.createElement('ul')
    ul.className = 'canvas__items'
    return ul
  }

  createLi({
    id = 'default',
    name = 'Мёртвые голоса',
    stopFirst = '#6b0000',
    stopSecond = '#1a0000',
  }) {
    let li = document.createElement('li')
    let className = `canvas__item canvas__item_${id}`
    li.dataset.line = id
    li.className = className
    li.innerText = name

    let mark = document.createElement('div')
    mark.className = `canvas__item-mark canvas__item-mark_${id}`
    mark.style.width = '10px'
    mark.style.height = '10px'
    mark.style.background = `linear-gradient(${stopFirst}, ${stopSecond})`
    mark.style.borderRadius = '50%'

    li.append(mark)

    return li
  }

  // Mouse events and perform the text

  addText() {
    this.chart.insertAdjacentHTML('beforeend', this.text)
  }

  deleteText() {
    let text = this.canvas.querySelector('.canvas__text-group')
    if (text) text.remove()
  }

  performText({ target }) {
    let line = target.dataset.line

    for (let { count, stopFirst, id } of this.options) {
      if (id && id === line) {
        this.text = this.createText(stopFirst, count)
        this.deleteText()
        this.addText()
        this.boldLine(id)
      }
    }
  }

  resetText() {
    this.deleteText()
    this.text = this.createText()
    this.addText()
    this.resetLine()
  }

  boldLine(id) {
    let circleLine = this.canvas.querySelector(`.canvas__unit_${id}`)
    if (circleLine) circleLine.classList.add('canvas__unit_hovered')
  }

  resetLine() {
    let hoveredLine = this.canvas.querySelector(`.canvas__unit_hovered`)
    if (hoveredLine) hoveredLine.classList.remove('canvas__unit_hovered')
  }
}

export default Canvas
