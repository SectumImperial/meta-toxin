import {
  PAGINATOR_ACTIVE_TRUE,
  PAGINATOR_LIACTIVE_TRUE,
  PAGINATOR_ITEM,
  PAGINATOR_BUTTONHIDDEN_TRUE,
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
      console.error(`Error in reading options ${err}`);
    }

    this.handleButtonPrevClick = this.handleButtonPrevClick.bind(this);
    this.handleButtonNextClick = this.handleButtonNextClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleButtonPrevPress = this.handleButtonPrevPress.bind(this);
    this.handleButtonNextPress = this.handleButtonNextPress.bind(this);
    this.handleItemPress = this.handleItemPress.bind(this);
    this.handleChangeScreen = this.handleChangeScreen.bind(this);

    this.init();
  }

  /**
   *
   * @param {string} className
   * @param {number or string} content of li
   * @param {boolean} dot
   */

  static createLiElement(className, content, isDots = false) {
    const tabIndex = isDots ? 1 : 0;
    const classElement = isDots ? `${className} ${className}_dots` : className;
    const dataElement = isDots ? `data-dots = ${isDots}` : `data-number = ${content}`;
    const element = `<li class = '${classElement}' ${dataElement}
      tabindex = ${tabIndex}>${content}</li>`;

    return element;
  }

  init() {
    this.#findElements();
    this.#createVars();
    this.#createPaginator();
    this.#setCurrentPage();
    this.#checkVisibilityBtn();
    this.#addListeners();
    this.#createText();
    return this;
  }

  #addListeners() {
    this.buttonPrev.addEventListener('click', this.handleButtonPrevClick);
    this.buttonNext.addEventListener('click', this.handleButtonNextClick);
    this.itemsPaginator.addEventListener('click', this.handleItemClick);

    this.buttonPrev.addEventListener('keydown', this.handleButtonPrevPress);
    this.buttonNext.addEventListener('keydown', this.handleButtonNextPress);
    this.itemsPaginator.addEventListener('keydown', this.handleItemPress);
    this.mediaQueryList.addEventListener('change', this.handleChangeScreen);
    return this;
  }

  handleButtonPrevClick() {
    this.#decrementPage();
    return this;
  }

  handleButtonNextClick() {
    this.#incrementPage();
    return this;
  }

  handleButtonPrevPress(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.#decrementPage();
  }

  handleButtonNextPress(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.#incrementPage();
  }

  handleItemPress(e) {
    const { code, target } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.#changePage(target);
    }
    return this;
  }

  handleItemClick({ target }) {
    this.#changePage(target);
    return this;
  }

  handleChangeScreen() {
    this.#removePaginator();
    this.#createPaginator();
    this.#setCurrentPage();
    return this;
  }

  #findElements() {
    this.itemsPaginator = this.paginator.querySelector(`.${ITEMS}`);
    this.buttonPrev = this.paginator.querySelector(`.${BTN_PREV}`);
    this.buttonNext = this.paginator.querySelector(`.${BTN_NEXT}`);
    this.liClass = PAGINATOR_ITEM;
    this.textElement = this.paginator.querySelector(`.${TEXT}`);
    return this;
  }

  #createVars() {
    this.count = COUNT_PAGE;
    this.currentPage = 1;
    this.startPage = 1;

    this.itemsPerPage = this.options.itemsPerPage;
    if (this.allItems <= 0) console.error('Zero or less items per page.');
    this.allItems = this.options.allItems;
    if (this.allItems <= 0) console.error('Zero or less counts.');
    this.text = this.options.text;

    this.pageCount = Math.ceil(this.allItems / this.itemsPerPage);
    this.mediaQueryList = window.matchMedia('(min-width: 500px)');
    return this;
  }

  #createPaginator() {
    let nextPage = Number(this.currentPage);
    let prevPage = Number(this.currentPage);

    if (this.#isPageCountSmall()) nextPage = this.pageCount;
    if (!this.#isPageCountSmall()) nextPage += 1;

    prevPage -= 1;

    if (this.currentPage === this.startPage) {
      this.#createBeginning();
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
    return this;
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

  #createMiddle(start, end) {
    let itemsLi = '';
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addFirstPage();
    }
    for (let i = start; i <= end; i += 1) {
      itemsLi += Paginator.createLiElement(this.liClass, i);
    }
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addLastPage();
    }

    this.itemsPaginator.insertAdjacentHTML('beforeend', itemsLi);
    return this;
  }

  #createBeginning() {
    const endCount = this.pageCount < COUNT_PAGE ? this.pageCount : COUNT_PAGE;
    let itemsLi = '';
    for (let i = this.startPage; i <= endCount; i += 1) {
      itemsLi += Paginator.createLiElement(this.liClass, i);
    }
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addLastPage();
    }

    this.itemsPaginator.insertAdjacentHTML('beforeend', itemsLi);
    return this;
  }

  #createStart(end) {
    const start = this.mediaQueryList.matches ? this.startPage : this.currentPage - 1;
    let itemsLi = '';
    for (let i = start; i <= end; i += 1) {
      itemsLi += Paginator.createLiElement(this.liClass, i);
    }
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addLastPage();
    }

    this.itemsPaginator.insertAdjacentHTML('beforeend', itemsLi);
    return this;
  }

  #createEnd(start) {
    const end = this.mediaQueryList.matches ? this.pageCount : this.currentPage + 1;
    let itemsLi = '';
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addFirstPage();
    }
    for (let i = start; i <= end; i += 1) {
      itemsLi += Paginator.createLiElement(this.liClass, i);
    }
    this.itemsPaginator.insertAdjacentHTML('beforeend', itemsLi);

    return this;
  }

  #createEnding() {
    let itemsLi = '';
    if (this.mediaQueryList.matches) {
      itemsLi += this.#addFirstPage();
    }
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i += 1) {
      itemsLi += Paginator.createLiElement(this.liClass, i);
    }
    this.itemsPaginator.insertAdjacentHTML('beforeend', itemsLi);
    return this;
  }

  #isPageCountSmall() {
    return this.pageCount < COUNT_PAGE;
  }

  #addLastPage() {
    if (this.#isPageCountSmall()) return '';
    let result = '';
    result += Paginator.createLiElement(this.liClass, '...', true);

    if (this.mediaQueryList.matches) {
      const lastLi = Paginator.createLiElement(this.liClass, this.pageCount);
      result += lastLi;
    }

    return result;
  }

  #addFirstPage() {
    if (this.#isPageCountSmall()) return '';
    let result = '';

    if (this.mediaQueryList.matches) {
      const lastLi = Paginator.createLiElement(this.liClass, this.startPage);
      result += lastLi;
    }
    result += Paginator.createLiElement(this.liClass, '...', true);

    return result;
  }

  #checkVisibilityBtn() {
    const activeItem = this.itemsPaginator.querySelector(`.${PAGINATOR_ACTIVE_TRUE}`);
    if (Number(activeItem.dataset.number) === 1) {
      this.buttonPrev.classList.add(PAGINATOR_BUTTONHIDDEN_TRUE);
      this.buttonPrev.tabIndex = '-1';
    }
    if (
      Number(activeItem.dataset.number) !== 1
      && this.buttonPrev.classList.contains(PAGINATOR_BUTTONHIDDEN_TRUE)
    ) {
      this.buttonPrev.classList.remove(PAGINATOR_BUTTONHIDDEN_TRUE);
      this.buttonPrev.tabIndex = '0';
    }

    if (Number(activeItem.dataset.number) === this.pageCount) {
      this.buttonNext.classList.add(PAGINATOR_BUTTONHIDDEN_TRUE);
      this.buttonNext.tabIndex = '-1';
    }
    if (
      Number(activeItem.dataset.number) !== this.pageCount
      && this.buttonNext.classList.contains(PAGINATOR_BUTTONHIDDEN_TRUE)
    ) {
      this.buttonNext.classList.remove(PAGINATOR_BUTTONHIDDEN_TRUE);
      this.buttonNext.tabIndex = '0';
    }
    return this;
  }

  #decrementPage() {
    if (this.currentPage !== 1) {
      this.#removePage();
      this.currentPage -= 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
      this.buttonPrev.focus();
    }
    return this;
  }

  #incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.#removePage();
      this.currentPage += 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
      this.buttonNext.focus();
    }
    return this;
  }

  #changePage(target) {
    if (!target.classList.contains(PAGINATOR_ITEM)) return;
    if (target.dataset.dots) return;
    this.#removePage();
    this.currentPage = Number(target.dataset.number);
    this.#removePaginator();
    this.#createPaginator();
    this.#setCurrentPage();
    this.#findCurrentPage().focus();
  }

  #findCurrentPage() {
    const page = this.itemsPaginator.querySelector(
      `.${PAGINATOR_ITEM}[data-number="${this.currentPage}"]`,
    );
    if (page === undefined || page === null) console.error('Current page has not found');
    return page;
  }

  #setCurrentPage() {
    const page = this.#findCurrentPage();
    page.classList.add(PAGINATOR_LIACTIVE_TRUE);
    page.classList.add(PAGINATOR_ACTIVE_TRUE);

    this.#checkVisibilityBtn();
    this.#createText();
    return this;
  }

  #removePage() {
    const current = this.#findCurrentPage();
    current.classList.remove(PAGINATOR_LIACTIVE_TRUE);
    current.classList.remove(PAGINATOR_ACTIVE_TRUE);
    return this;
  }

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
    return this;
  }

  #removePaginator() {
    this.itemsPaginator.innerHTML = '';
    return this;
  }
}

export default Paginator;
