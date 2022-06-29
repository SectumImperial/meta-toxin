import './checkbox-list.scss'

class CheckboxList {
  constructor(selector) {
    this.checkboxList = selector
    this.init()
  }

  init() {
    this.list = this.checkboxList.querySelector('.checkbox-list__items')
    this.addListeners()
  }

  addListeners() {
    this.checkboxList.addEventListener('click', this.toggle.bind(this))
  }

  toggle() {
    if (this.checkboxList.classList.contains('_active')) {
      this.checkboxList.classList.remove('_active')
      this.list.style.display = 'none'
    } else {
      this.checkboxList.classList.add('_active')
      this.list.style.display = 'block'
    }
  }
}

export default CheckboxList
