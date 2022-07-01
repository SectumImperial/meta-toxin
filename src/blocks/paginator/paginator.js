import './paginator.scss'

import {
  ACTIVE_JS,
  ACTIVE_LI,
  LI_CLASS,
  HIDE,
  COUNT_PAGE,
} from './constants.js'

class Paginator {
  constructor(element) {
    this.paginator = element
    this.init()
  }

  init() {
    this.options
    this.content = this.paginator.querySelector('.paginator__content')
    this.itemsPaginator = this.paginator.querySelector('.paginator__items')
    this.btnPrev = this.paginator.querySelector('.paginator__button_prev')
    this.btnNext = this.paginator.querySelector('.paginator__button_next')
    this.liClass = LI_CLASS
    this.textElement = this.paginator.querySelector('.paginator__text')
    this.count = COUNT_PAGE
    this.currentPage = 1

    try {
      this.options = JSON.parse(this.paginator.dataset.paginator)
    } catch (err) {
      throw new Error(`Ошибка в чтении данных опций ${err}`)
    }

    this.itemsPerPage = this.options.itemsPerPage
    this.allItems = this.options.allItems
    this.text = this.options.text

    this.pageCount = Math.ceil(this.allItems / this.itemsPerPage)

    this.createPaginator()
    this.checkVisibilityBtn()
    this.addListeners()
    this.createText()
  }

  createPaginator() {
    for (let i = this.currentPage; i <= this.pageCount; i++) {
      let li = document.createElement('li')
      li.className = this.liClass
      if (i === 1) {
        li.classList.add(ACTIVE_LI)
        li.classList.add(ACTIVE_JS)
      }
      li.innerText = i
      li.dataset.number = i
      this.itemsPaginator.append(li)
    }
  }

  addListeners() {
    this.btnPrev.addEventListener('click', this.decrementPage.bind(this))
    this.btnNext.addEventListener('click', this.incrementPage.bind(this))
    this.itemsPaginator.addEventListener('click', this.changePage.bind(this))
  }

  createText() {
    let string = ''
  }

  checkVisibilityBtn() {
    const activeItem = this.itemsPaginator.querySelector(`.${ACTIVE_JS}`)
    // Скрыть и показать пред. кнопку
    if (Number(activeItem.dataset.number) === 1) {
      this.btnPrev.classList.add(HIDE)
    }
    if (
      Number(activeItem.dataset.number) !== 1 &&
      this.btnPrev.classList.contains(HIDE)
    ) {
      this.btnPrev.classList.remove(HIDE)
    }

    // Скрыть и показать последнюю кнопку
    if (Number(activeItem.dataset.number) === this.pageCount) {
      this.btnNext.classList.add(HIDE)
    }
    if (
      Number(activeItem.dataset.number) !== this.pageCount &&
      this.btnNext.classList.contains(HIDE)
    ) {
      this.btnNext.classList.remove(HIDE)
    }
  }

  decrementPage() {
    if (this.currentPage !== 1) {
      let current = this.itemsPaginator.querySelector(
        `.paginator__item[data-number="${this.currentPage}"]`
      )
      current.classList.remove(ACTIVE_LI)
      current.classList.remove(ACTIVE_JS)
      this.currentPage--

      let newPage = this.itemsPaginator.querySelector(
        `.paginator__item[data-number="${this.currentPage}"]`
      )
      newPage.classList.add(ACTIVE_LI)
      newPage.classList.add(ACTIVE_JS)

      this.checkVisibilityBtn()
    }
  }

  incrementPage() {
    if (this.currentPage !== this.pageCount) {
      let current = this.itemsPaginator.querySelector(
        `.paginator__item[data-number="${this.currentPage}"]`
      )
      current.classList.remove(ACTIVE_LI)
      current.classList.remove(ACTIVE_JS)
      this.currentPage++

      let newPage = this.itemsPaginator.querySelector(
        `.paginator__item[data-number="${this.currentPage}"]`
      )
      newPage.classList.add(ACTIVE_LI)
      newPage.classList.add(ACTIVE_JS)

      this.checkVisibilityBtn()
    }
  }

  changePage({ target }) {
    if (!target.classList.contains('paginator__item')) return
    let current = this.itemsPaginator.querySelector(
      `.paginator__item[data-number="${this.currentPage}"]`
    )
    current.classList.remove(ACTIVE_LI)
    current.classList.remove(ACTIVE_JS)

    this.currentPage = target.dataset.number
    target.classList.add(ACTIVE_LI)
    target.classList.add(ACTIVE_JS)

    this.checkVisibilityBtn()
  }
}

export default Paginator
