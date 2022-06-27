import './checkbox-list.scss'

class CheckboxList {
  constructor(selector) {
    this.checkboxList = selector
    this.init()
  }

  init() {
    this.addListeners()
  }

  addListeners() {
    console.log(this.checkboxList)
    this.checkboxList.addEventListener('click', this.addToggle.bind(this))
  }

  addToggle({ target }) {
    target.classList.toggle('._active')
  }
}

export default CheckboxList
