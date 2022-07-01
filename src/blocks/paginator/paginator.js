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
    this.itemsPaginator = this.paginator.querySelector('.paginator__items')
    this.btnPrev = this.paginator.querySelector('.paginator__button_prev')
    this.btnNext = this.paginator.querySelector('.paginator__button_next')
    this.liClass = LI_CLASS
    this.textElement = this.paginator.querySelector('.paginator__text')
    this.count = COUNT_PAGE
    this.currentPage = 1
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

  addListeners() {
    this.btnPrev.addEventListener('click', this.decrementPage.bind(this))
    this.btnNext.addEventListener('click', this.incrementPage.bind(this))
    this.itemsPaginator.addEventListener('click', this.changePage.bind(this))
  }

  //   Методы создания и отображения страниц
  createPaginator() {
    let end = Number(this.currentPage)
    let start = Number(this.currentPage)
    end++
    start--

    // Если на 4 или если на 12 или если в середине
    if (this.currentPage === this.startPage) {
      this.createBegining()
    } else if (
      this.currentPage === COUNT_PAGE + 1 ||
      this.currentPage <= COUNT_PAGE
    ) {
      this.createStart(end)
    } else if (
      this.currentPage === this.pageCount - COUNT_PAGE ||
      (this.currentPage >= this.pageCount - COUNT_PAGE &&
        this.currentPage !== this.pageCount)
    ) {
      this.createEnd(start)
    } else if (this.currentPage === this.pageCount) {
      this.createEnding()
    } else if (
      this.currentPage > COUNT_PAGE &&
      this.currentPage < this.pageCount - COUNT_PAGE
    ) {
      this.createMiddle(start, end)
    }
  }

  createMiddle(start, end) {
    for (let i = start; i <= end; i++) {
      let li = this.createLiElement(this.liClass, i)
      this.itemsPaginator.append(li)
    }
    this.addFirstPage()
    this.addLastPage()
  }

  createBegining() {
    for (let i = this.startPage; i <= COUNT_PAGE; i++) {
      let li = this.createLiElement(this.liClass, i)
      this.itemsPaginator.append(li)
    }

    this.addLastPage()
  }

  createStart(end) {
    for (let i = this.startPage; i <= end; i++) {
      let li = this.createLiElement(this.liClass, i)
      this.itemsPaginator.append(li)
    }
    this.addLastPage()
  }

  createEnd(start) {
    for (let i = start; i <= this.pageCount; i++) {
      let li = this.createLiElement(this.liClass, i)
      this.itemsPaginator.append(li)
    }
    this.addFirstPage()
  }

  createEnding() {
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i++) {
      let li = this.createLiElement(this.liClass, i)
      this.itemsPaginator.append(li)
    }

    this.addFirstPage()
  }

  addLastPage() {
    // Добавить точки
    let dots = this.createLiElement(this.liClass, '...', true)
    this.itemsPaginator.append(dots)

    // Добавить последнюю страницу
    let lastLi = this.createLiElement(this.liClass, this.pageCount)
    this.itemsPaginator.append(lastLi)
  }

  addFirstPage() {
    // Добавить точки
    let dots = this.createLiElement(this.liClass, '...', true)
    this.itemsPaginator.prepend(dots)

    // Добавить последнюю страницу
    let firstLi = this.createLiElement(this.liClass, this.startPage)
    this.itemsPaginator.prepend(firstLi)
  }

  //   Конец методов создания и отображения страниц

  /**
   *
   * @param {string} className
   * @param {number or string} content of li
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

  //   Проверить видимость кнопок переключения
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

  //   Клик по кнопке назад
  decrementPage() {
    if (this.currentPage !== 1) {
      this.removePage()
      this.currentPage--
      this.removePaginator()
      this.createPaginator()
      this.setCurrentPage()
    }
  }

  //   Клик по кнопке вперёд
  incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.removePage()
      this.currentPage++
      this.removePaginator()
      this.createPaginator()
      this.setCurrentPage()
    }
  }

  //   Клик по номеру страницы
  changePage({ target }) {
    if (!target.classList.contains('paginator__item')) return
    if (target.dataset.dots) return
    this.removePage()
    this.currentPage = target.dataset.number
    this.removePaginator()
    this.createPaginator()
    this.setCurrentPage()
  }

  //   Установить тек. страницу
  setCurrentPage() {
    let page = this.itemsPaginator.querySelector(
      `.paginator__item[data-number="${this.currentPage}"]`
    )

    page.classList.add(ACTIVE_LI)
    page.classList.add(ACTIVE_JS)

    this.checkVisibilityBtn()
    this.createText()
  }

  //   Удалить классы тек. страницы
  removePage() {
    let current = this.itemsPaginator.querySelector(
      `.paginator__item[data-number="${this.currentPage}"]`
    )
    current.classList.remove(ACTIVE_LI)
    current.classList.remove(ACTIVE_JS)
  }

  //   Создать строку описания
  createText() {
    let string = ''
    let lastCount = this.currentPage * this.itemsPerPage
    let firstCount = lastCount - this.itemsPerPage + 1
    let from = ''
    if (this.allItems > 100) {
      from = '100+'
    } else {
      from = this.allItems
    }
    string = `${firstCount} - ${lastCount} из ${from} ${this.text}`
    this.textElement.innerText = string
  }
}

export default Paginator
