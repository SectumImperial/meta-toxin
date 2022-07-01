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
    this.currentPage = 6
    this.startPage = 1

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
    this.setCurrentPage()
    this.checkVisibilityBtn()
    this.addListeners()
    this.createText()
  }

  createPaginator() {
    let end = Number(this.currentPage)
    let start = Number(this.currentPage)
    end++
    start--

    if (
      this.currentPage > COUNT_PAGE &&
      this.currentPage < this.pageCount - COUNT_PAGE
    ) {
      for (let i = start; i <= end; i++) {
        // let li = document.createElement('li')
        // li.className = this.liClass

        // li.innerText = i
        // li.dataset.number = i
        // this.itemsPaginator.append(li)

        let li = this.createLiElement(this.liClass, i)
        this.itemsPaginator.append(li)
      }

      //   Добавить точки
      let li = this.createLiElement(this.liClass, '...', true)
      this.itemsPaginator.append(li)
      this.itemsPaginator.prepend(li.cloneNode(true))

      //   Добавить первую страницу
      let startLi = this.createLiElement(this.liClass, this.startPage)
      this.itemsPaginator.prepend(startLi)

      // Добавить последнюю страницу
      let lastLi = this.createLiElement(this.liClass, this.pageCount)
      this.itemsPaginator.append(lastLi)
    }
  }

  /**
   *
   * @param {string} className
   * @param {number or string} number
   * @param {boolean} dot
   */
  createLiElement(className, content, dots = false) {
    let el = document.createElement('li')
    el.className = className
    el.innerText = content
    if (dots) {
      el.dataset.dots = true
      el.classList.add(`${this.liClass}_dots`)
    } else {
      el.dataset.number = content
    }
    return el
  }
  removePaginator() {
    this.itemsPaginator.innerHTML = ''
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
      this.removePage()
      this.currentPage--
      this.removePaginator()
      this.createPaginator()
      this.setCurrentPage()
    }
  }

  incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.removePage()
      this.currentPage++
      this.removePaginator()
      this.createPaginator()
      this.setCurrentPage()
    }
  }

  changePage({ target }) {
    if (!target.classList.contains('paginator__item')) return
    if (target.dataset.dots) return
    this.removePage()
    this.currentPage = target.dataset.number
    this.removePaginator()
    this.createPaginator()
    this.setCurrentPage()
  }

  setCurrentPage() {
    let page = this.itemsPaginator.querySelector(
      `.paginator__item[data-number="${this.currentPage}"]`
    )

    page.classList.add(ACTIVE_LI)
    page.classList.add(ACTIVE_JS)

    this.checkVisibilityBtn()
  }

  removePage() {
    let current = this.itemsPaginator.querySelector(
      `.paginator__item[data-number="${this.currentPage}"]`
    )
    current.classList.remove(ACTIVE_LI)
    current.classList.remove(ACTIVE_JS)
  }
}

export default Paginator
