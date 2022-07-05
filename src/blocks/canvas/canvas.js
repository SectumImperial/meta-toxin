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

    this.defs = this.createDefs()
    this.circles = this.createCircles()
    console.log(this.circles)
    this.svg = this.createSvg()

    this.addSvg()
  }

  sumCount() {
    let sum = 0
    for (let option of this.options) {
      sum += option.count
    }

    if (isNaN(sum)) throw new Error('Ошибка в подсчёте суммы голосов')
    return sum
  }

  createSvg() {
    let svgTemp = `<svg class="chart" width="120" height="120" viewBox="0 0 35 30">
    ${this.defs}
    ${this.circles.join('')}
    </svg>`
    return svgTemp
  }

  addSvg() {
    this.canvas.insertAdjacentHTML('beforeend', this.svg)
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
}

export default Canvas

const canvas = document.querySelector('.canvas')
const canvasTemplate = `
<svg class="chart" width="120" height="120" viewBox="0 0 35 30">
    <defs>
        <linearGradient id="great" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#ffe39c"/>
            <stop offset="100%" stop-color="#ffba9c"/>
        </linearGradient>

        <linearGradient id="good" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#bc9cff"/>
            <stop offset="100%" stop-color="#8ba4f9"/>
        </linearGradient>

        <linearGradient id="satisfy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#6fcf97"/>
            <stop offset="100%" stop-color="#66d2ea"/>
        </linearGradient>

        <linearGradient id="bad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#919191"/>
            <stop offset="100%" stop-color="#3d4975"/>
        </linearGradient>
    </defs>

    <circle class="canvas__unit canvas__unit_bad" r="15.9" cx="50%" cy="50%" stroke="url(#bad)" stroke-dasharray="0 100" stroke-dashoffset="0"></circle>
    <circle class="canvas__unit canvas__unit_satisfy" r="15.9" cx="50%" cy="50%" stroke="url(#satisfy)" stroke-dasharray="24 100" stroke-dashoffset="0"></circle>
    <circle class="canvas__unit canvas__unit_great" r="15.9" cx="50%" cy="50%" stroke="url(#great)" stroke-dasharray="49 100" stroke-dashoffset="-25"></circle>
    <circle class="canvas__unit canvas__unit_good" r="15.9" cx="50%" cy="50%" stroke="url(#good)" stroke-dasharray="24 100" stroke-dashoffset="-76"></circle>
    
    
  </svg>`
