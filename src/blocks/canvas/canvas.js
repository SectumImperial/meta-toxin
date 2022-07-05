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
    this.svg = this.createSvg()

    this.addSvg()

    this.legendBlock.append(this.createList())
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
    this.svgBlock.insertAdjacentHTML('beforeend', this.svg)
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
  createText() {
    return 'test'
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
}

export default Canvas
