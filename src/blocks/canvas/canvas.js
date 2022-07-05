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
    this.defs = this.createDefs()
    console.log(this.defs)
    this.svg = this.createSvg()
    this.addSvg()
  }

  createSvg() {
    let svgTemp = `<svg class="chart" width="120" height="120" viewBox="0 0 35 30">
    ${this.defs}
    ${this.circle}
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

  createDef(option) {
    let {
      id = 'default',
      stopFirst = '#6b0000',
      stopSecond = '#1a0000',
    } = option
    return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${stopFirst}"/><stop offset="100%" stop-color="${stopSecond}"/></linearGradient>`
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
    <circle class="canvas__unit canvas__unit_satisfy" r="15.9" cx="50%" cy="50%" stroke="url(#satisfy)" stroke-dasharray="24 100" stroke-dashoffset="-1"></circle>
    <circle class="canvas__unit canvas__unit_great" r="15.9" cx="50%" cy="50%" stroke="url(#great)" stroke-dasharray="49 100" stroke-dashoffset="-26"></circle>
    <circle class="canvas__unit canvas__unit_good" r="15.9" cx="50%" cy="50%" stroke="url(#good)" stroke-dasharray="24 100" stroke-dashoffset="-76"></circle>
    
    
  </svg>`
