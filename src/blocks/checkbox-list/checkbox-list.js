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

  toggle({ target }) {
    if (target.closest('.js_opened')) return
    if (this.checkboxList.classList.contains('js_active')) {
      this.checkboxList.classList.remove('js_active')
      this.list.classList.remove('js_opened_list')
    } else {
      this.checkboxList.classList.add('js_active')
      this.list.classList.add('js_opened_list')
    }
  }
}

export default CheckboxList
