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
    this.#findElems();
    this.#createVars();
    this.#createPaginator();
    this.#setCurrentPage();
    this.#checkVisibilityBtn();
    this.#addListeners();
    this.#createText();
  }

  #findElems() {
    this.itemsPaginator = this.paginator.querySelector(`.${ITEMS}`);
    this.btnPrev = this.paginator.querySelector(`.${BTN_PREV}`);
    this.btnNext = this.paginator.querySelector(`.${BTN_NEXT}`);
    this.liClass = LI_CLASS;
    this.textElement = this.paginator.querySelector(`.${TEXT}`);
  }

  #createVars() {
    this.count = COUNT_PAGE;
    this.currentPage = 1;
    this.startPage = 1;

    this.itemsPerPage = this.options.itemsPerPage;
    if (this.allItems <= 0) throw new Error('Zero or less items per page. I disagree to work with this. Fix it.');
    this.allItems = this.options.allItems;
    if (this.allItems <= 0) throw new Error('Zero or less counts. I disagree to work with this. Fix it.');
    this.text = this.options.text;

    this.pageCount = Math.ceil(this.allItems / this.itemsPerPage);
  }

  #addListeners() {
    this.btnPrev.addEventListener('click', this.#decrementPage.bind(this));
    this.btnNext.addEventListener('click', this.#incrementPage.bind(this));
    this.itemsPaginator.addEventListener('click', this.#changePage.bind(this));

    this.btnPrev.addEventListener('keydown', this.#keyDecrementPage.bind(this));
    this.btnNext.addEventListener('keydown', this.#keyInecrementPage.bind(this));
    this.itemsPaginator.addEventListener('keydown', this.#keyChangePage.bind(this));
  }

  #isInStart() {
    return this.currentPage === COUNT_PAGE + 1
    || this.currentPage <= COUNT_PAGE;
  }

  #isInEnd() {
    return this.currentPage === this.pageCount - COUNT_PAGE
    || (this.currentPage >= this.pageCount - COUNT_PAGE
      && this.currentPage !== this.pageCount);
  }

  #isInMiddle() {
    return this.currentPage > COUNT_PAGE
    && this.currentPage < this.pageCount - COUNT_PAGE;
  }

  //   Методы создания и отображения страниц
  #createPaginator() {
    let nextPage = Number(this.currentPage);
    let prevPage = Number(this.currentPage);

    if (this.#isPageCountSmall()) nextPage = this.pageCount;
    if (!this.#isPageCountSmall()) nextPage += 1;

    prevPage -= 1;

    if (this.currentPage === this.startPage) {
      this.#createBegining();
    } else if (this.#isInStart()) {
      this.#createStart(nextPage);
    } else if (
      this.#isInEnd()
    ) {
      this.#createEnd(prevPage);
    } else if (this.currentPage === this.pageCount) {
      this.#createEnding();
    } else if (this.#isInMiddle()) {
      this.#createMiddle(prevPage, nextPage);
    }
  }

  #createMiddle(start, end) {
    // eslint-disable-next-line no-plusplus
    for (let i = start; i <= end; i++) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.#addFirstPage();
    this.#addLastPage();
  }

  #createBegining() {
    // eslint-disable-next-line no-plusplus
    const endCount = this.pageCount < COUNT_PAGE ? this.pageCount : COUNT_PAGE;
    for (let i = this.startPage; i <= endCount; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    this.#addLastPage();
  }

  #createStart(end) {
    // eslint-disable-next-line no-plusplus
    for (let i = this.startPage; i <= end; i++) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.#addLastPage();
  }

  #createEnd(start) {
    // eslint-disable-next-line no-plusplus
    for (let i = start; i <= this.pageCount; i++) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }
    this.#addFirstPage();
  }

  #createEnding() {
    // eslint-disable-next-line no-plusplus
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i++) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    this.#addFirstPage();
  }

  #isPageCountSmall() {
    return this.pageCount < COUNT_PAGE;
  }

  #addLastPage() {
    if (this.#isPageCountSmall()) return;
    // Add dots
    const dots = this.#createLiElement(this.liClass, '...', true);
    this.itemsPaginator.append(dots);

    // Add the first page
    const lastLi = this.#createLiElement(this.liClass, this.pageCount);
    this.itemsPaginator.append(lastLi);
  }

  #addFirstPage() {
    if (this.#isPageCountSmall()) return;
    // Add dots
    const dots = this.#createLiElement(this.liClass, '...', true);
    this.itemsPaginator.prepend(dots);

    // Add the last page
    const firstLi = this.#createLiElement(this.liClass, this.startPage);
    this.itemsPaginator.prepend(firstLi);
  }

  // End of the methods creating and displaying pages

  /**
   *
   * @param {string} className
   * @param {number or string} content of li
   * @param {boolean} dot
   */
  #createLiElement(className, content, dots = false) {
    const el = document.createElement('li');
    el.className = className;
    el.innerText = content;
    if (!dots) {
      el.tabIndex = 0;
    }
    if (dots) {
      el.dataset.dots = true;
      el.classList.add(`${this.liClass}_dots`);
    } else {
      el.dataset.number = content;
    }
    return el;
  }

  //   Проверить видимость кнопок переключения
  #checkVisibilityBtn() {
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
  #decrementPage() {
    if (this.currentPage !== 1) {
      this.#removePage();
      this.currentPage -= 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
    }
  }

  //   Клик по кнопке вперёд
  #incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.#removePage();
      this.currentPage += 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
    }
  }

  //   Клик по номеру страницы
  #changePage({ target }) {
    if (!target.classList.contains(LI_CLASS)) return;
    if (target.dataset.dots) return;
    this.#removePage();
    this.currentPage = Number(target.dataset.number);
    this.#removePaginator();
    this.#createPaginator();
    this.#setCurrentPage();
  }

  #findCurrentPage() {
    const page = this.itemsPaginator.querySelector(
      `.${LI_CLASS}[data-number="${this.currentPage}"]`,
    );
    if (!page) throw new Error('Current page has not found');
    return page;
  }

  //   Установить тек. страницу
  #setCurrentPage() {
    const page = this.#findCurrentPage();
    page.classList.add(ACTIVE_LI);
    page.classList.add(ACTIVE_JS);

    this.#checkVisibilityBtn();
    this.#createText();
  }

  //   Удалить классы тек. страницы
  #removePage() {
    const current = this.#findCurrentPage();
    current.classList.remove(ACTIVE_LI);
    current.classList.remove(ACTIVE_JS);
  }

  //   Создать строку описания
  #createText() {
    let string = '';
    let lastCount = this.currentPage * this.itemsPerPage;
    const firstCount = lastCount - this.itemsPerPage + 1;
    let from = '';
    if (this.allItems > 100) {
      from = '100+';
    } else {
      from = this.allItems;
    }
    if (lastCount > from) lastCount = from;

    string = `${firstCount} - ${lastCount} из ${from} ${this.text}`;
    this.textElement.innerText = string;
  }

  #removePaginator() {
    this.itemsPaginator.innerHTML = '';
  }

  #keyDecrementPage(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.#decrementPage();
  }

  #keyInecrementPage(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.incrementPage();
  }

  #keyChangePage(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.changePage(e);
  }
}

export default Paginator;
