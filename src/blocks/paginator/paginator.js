/* eslint-disable linebreak-style */
import {
  ACTIVE_JS,
  ACTIVE_LI,
  LI_CLASS,
  HIDE,
  COUNT_PAGE,
  ITEMS,
  BTN_PREV,
  BTN_NEXT,
  TEXT,
} from './constants';

class Paginator {
  constructor(element) {
    this.paginator = element;
    try {
      this.options = JSON.parse(this.paginator.dataset.paginator);
    } catch (err) {
      throw new Error(`Error in reading options ${err}`);
    }
    this.init();
  }

  init() {
    this.findElems();
    this.createVars();
    this.createPaginator();
    this.setCurrentPage();
    this.checkVisibilityBtn();
    this.addListeners();
    this.createText();
  }

  findElems() {
    this.itemsPaginator = this.paginator.querySelector(`.${ITEMS}`);
    this.btnPrev = this.paginator.querySelector(`.${BTN_PREV}`);
    this.btnNext = this.paginator.querySelector(`.${BTN_NEXT}`);
    this.liClass = LI_CLASS;
    this.textElement = this.paginator.querySelector(`.${TEXT}`);
  }

  createVars() {
    this.count = COUNT_PAGE;
    this.currentPage = 1;
    this.startPage = 1;

    this.itemsPerPage = this.options.itemsPerPage;
    this.allItems = this.options.allItems;
    this.text = this.options.text;

    this.pageCount = Math.ceil(this.allItems / this.itemsPerPage);
  }

  addListeners() {
    this.btnPrev.addEventListener('click', this.decrementPage.bind(this));
    this.btnNext.addEventListener('click', this.incrementPage.bind(this));
    this.itemsPaginator.addEventListener('click', this.changePage.bind(this));
  }

  static isInStart(currentPage) {
    return currentPage === COUNT_PAGE + 1
    || currentPage <= COUNT_PAGE;
  }

  static isInEnd(currentPage, pageCount) {
    return currentPage === pageCount - COUNT_PAGE
    || (currentPage >= pageCount - COUNT_PAGE
      && currentPage !== pageCount);
  }

  static isInMiddle(currentPage, pageCount) {
    return currentPage > COUNT_PAGE
    && currentPage < pageCount - COUNT_PAGE;
  }

  //   Методы создания и отображения страниц
  createPaginator() {
    let end = Number(this.currentPage);
    let start = Number(this.currentPage);
    end += 1;
    start -= 1;

    // Если на 4 или если на 12 или если в середине
    if (this.currentPage === this.startPage) {
      this.createBegining();
    } else if (Paginator.isInStart(this.currentPage)) {
      this.createStart(end);
    } else if (Paginator.isInEnd(this.currentPage, this.pageCount)
    ) {
      this.createEnd(start);
    } else if (this.currentPage === this.pageCount) {
      this.createEnding();
    } else if (Paginator.isInMiddle(this.currentPage, this.pageCount)) {
      this.createMiddle(start, end);
    }
  }

  createMiddle(start, end) {
    for (let i = start; i <= end; i += 1) {
      const li = this.createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.addFirstPage();
    this.addLastPage();
  }

  createBegining() {
    // eslint-disable-next-line no-plusplus
    for (let i = this.startPage; i <= COUNT_PAGE; i++) {
      const li = this.createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    this.addLastPage();
  }

  createStart(end) {
    // eslint-disable-next-line no-plusplus
    for (let i = this.startPage; i <= end; i++) {
      const li = this.createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.addLastPage();
  }

  createEnd(start) {
    // eslint-disable-next-line no-plusplus
    for (let i = start; i <= this.pageCount; i++) {
      const li = this.createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.addFirstPage();
  }

  createEnding() {
    // eslint-disable-next-line no-plusplus
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i++) {
      const li = this.createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    this.addFirstPage();
  }

  addLastPage() {
    // Добавить точки
    const dots = this.createLiElement(this.liClass, '...', true);
    this.itemsPaginator.append(dots);

    // Добавить последнюю страницу
    const lastLi = this.createLiElement(this.liClass, this.pageCount);
    this.itemsPaginator.append(lastLi);
  }

  addFirstPage() {
    // Добавить точки
    const dots = this.createLiElement(this.liClass, '...', true);
    this.itemsPaginator.prepend(dots);

    // Добавить последнюю страницу
    const firstLi = this.createLiElement(this.liClass, this.startPage);
    this.itemsPaginator.prepend(firstLi);
  }

  //   Конец методов создания и отображения страниц

  /**
   *
   * @param {string} className
   * @param {number or string} content of li
   * @param {boolean} dot
   */
  createLiElement(className, content, dots = false) {
    const el = document.createElement('li');
    el.className = className;
    el.innerText = content;
    if (dots) {
      el.dataset.dots = true;
      el.classList.add(`${this.liClass}_dots`);
    } else {
      el.dataset.number = content;
    }
    return el;
  }

  //   Проверить видимость кнопок переключения
  checkVisibilityBtn() {
    const activeItem = this.itemsPaginator.querySelector(`.${ACTIVE_JS}`);
    // Скрыть и показать пред. кнопку
    if (Number(activeItem.dataset.number) === 1) {
      this.btnPrev.classList.add(HIDE);
    }
    if (
      Number(activeItem.dataset.number) !== 1
      && this.btnPrev.classList.contains(HIDE)
    ) {
      this.btnPrev.classList.remove(HIDE);
    }

    // Скрыть и показать последнюю кнопку
    if (Number(activeItem.dataset.number) === this.pageCount) {
      this.btnNext.classList.add(HIDE);
    }
    if (
      Number(activeItem.dataset.number) !== this.pageCount
      && this.btnNext.classList.contains(HIDE)
    ) {
      this.btnNext.classList.remove(HIDE);
    }
  }

  //   Клик по кнопке назад
  decrementPage() {
    if (this.currentPage !== 1) {
      this.removePage();
      this.currentPage -= 1;
      this.removePaginator();
      this.createPaginator();
      this.setCurrentPage();
    }
  }

  //   Клик по кнопке вперёд
  incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.removePage();
      this.currentPage += 1;
      this.removePaginator();
      this.createPaginator();
      this.setCurrentPage();
    }
  }

  //   Клик по номеру страницы
  changePage({ target }) {
    if (!target.classList.contains(LI_CLASS)) return;
    if (target.dataset.dots) return;
    this.removePage();
    this.currentPage = target.dataset.number;
    this.removePaginator();
    this.createPaginator();
    this.setCurrentPage();
  }

  findCurrentPage() {
    const page = this.itemsPaginator.querySelector(
      `.${LI_CLASS}[data-number="${this.currentPage}"]`,
    );
    if (!page) throw new Error('Current page has not found');
    return page;
  }

  //   Установить тек. страницу
  setCurrentPage() {
    const page = this.findCurrentPage();
    page.classList.add(ACTIVE_LI);
    page.classList.add(ACTIVE_JS);

    this.checkVisibilityBtn();
    this.createText();
  }

  //   Удалить классы тек. страницы
  removePage() {
    const current = this.findCurrentPage();
    current.classList.remove(ACTIVE_LI);
    current.classList.remove(ACTIVE_JS);
  }

  //   Создать строку описания
  createText() {
    let string = '';
    const lastCount = this.currentPage * this.itemsPerPage;
    const firstCount = lastCount - this.itemsPerPage + 1;
    let from = '';
    if (this.allItems > 100) {
      from = '100+';
    } else {
      from = this.allItems;
    }
    string = `${firstCount} - ${lastCount} из ${from} ${this.text}`;
    this.textElement.innerText = string;
  }

  removePaginator() {
    this.itemsPaginator.innerHTML = '';
  }
}

export default Paginator;
