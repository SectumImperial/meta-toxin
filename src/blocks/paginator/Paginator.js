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

  #addListeners() {
    this.btnPrev.addEventListener('click', this.#handleButtonPrevClick.bind(this));
    this.btnNext.addEventListener('click', this.#handleButtonNextClick.bind(this));
    this.itemsPaginator.addEventListener('click', this.#handleItemClick.bind(this));

    this.btnPrev.addEventListener('keydown', this.#handleButtonPrevPress.bind(this));
    this.btnNext.addEventListener('keydown', this.#handleButtonNextPress.bind(this));
    this.itemsPaginator.addEventListener('keydown', this.#handleItemPress.bind(this));
    this.mediaQueryList.addEventListener('change', this.#handleChangeScreen.bind(this));
  }

  #handleButtonPrevClick() {
    this.#decrementPage();
  }

  #handleButtonNextClick() {
    this.#incrementPage();
  }

  #handleButtonPrevPress(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.#decrementPage();
  }

  #handleButtonNextPress(e) {
    const { code } = e;
    if (code !== 'Space') return;
    e.preventDefault();
    this.#incrementPage();
  }

  #handleItemPress(e) {
    const { code, target } = e;
    if (code === 'Space' || code === 'Enter') {
      e.preventDefault();
      this.#changePage(target);
    }
  }

  #handleItemClick({ target }) {
    this.#changePage(target);
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
    if (this.allItems <= 0) throw new Error('Zero or less items per page.');
    this.allItems = this.options.allItems;
    if (this.allItems <= 0) throw new Error('Zero or less counts.');
    this.text = this.options.text;

    this.pageCount = Math.ceil(this.allItems / this.itemsPerPage);
    this.mediaQueryList = window.matchMedia('(min-width: 500px)');
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
    for (let i = start; i <= end; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addFirstPage();
      this.#addLastPage();
    }
  }

  #createBeginning() {
    const endCount = this.pageCount < COUNT_PAGE ? this.pageCount : COUNT_PAGE;
    for (let i = this.startPage; i <= endCount; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addLastPage();
    }
  }

  #createStart(end) {
    const start = this.mediaQueryList.matches ? this.startPage : this.currentPage - 1;
    for (let i = start; i <= end; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addLastPage();
    }
  }

  #createEnd(start) {
    const end = this.mediaQueryList.matches ? this.pageCount : this.currentPage + 1;
    for (let i = start; i <= end; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addFirstPage();
    }
  }

  #createEnding() {
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addFirstPage();
    }
  }

  #isPageCountSmall() {
    return this.pageCount < COUNT_PAGE;
  }

  #addLastPage() {
    if (this.#isPageCountSmall()) return;
    const dots = this.#createLiElement(this.liClass, '...', true);
    this.itemsPaginator.append(dots);

    if (this.mediaQueryList.matches) {
      const lastLi = this.#createLiElement(this.liClass, this.pageCount);
      this.itemsPaginator.append(lastLi);
    }
  }

  #addFirstPage() {
    if (this.#isPageCountSmall()) return;
    const dots = this.#createLiElement(this.liClass, '...', true);
    this.itemsPaginator.prepend(dots);

    if (this.mediaQueryList.matches) {
      const firstLi = this.#createLiElement(this.liClass, this.startPage);
      this.itemsPaginator.prepend(firstLi);
    }
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

  #checkVisibilityBtn() {
    const activeItem = this.itemsPaginator.querySelector(`.${ACTIVE_JS}`);
    if (Number(activeItem.dataset.number) === 1) {
      this.btnPrev.classList.add(HIDE);
    }
    if (
      Number(activeItem.dataset.number) !== 1
      && this.btnPrev.classList.contains(HIDE)
    ) {
      this.btnPrev.classList.remove(HIDE);
    }

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

  #decrementPage() {
    if (this.currentPage !== 1) {
      this.#removePage();
      this.currentPage -= 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
    }
  }

  #incrementPage() {
    if (this.currentPage !== this.pageCount) {
      this.#removePage();
      this.currentPage += 1;
      this.#removePaginator();
      this.#createPaginator();
      this.#setCurrentPage();
    }
  }

  #changePage(target) {
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

  #setCurrentPage() {
    const page = this.#findCurrentPage();
    page.classList.add(ACTIVE_LI);
    page.classList.add(ACTIVE_JS);
    page.focus();

    this.#checkVisibilityBtn();
    this.#createText();
  }

  #removePage() {
    const current = this.#findCurrentPage();
    current.classList.remove(ACTIVE_LI);
    current.classList.remove(ACTIVE_JS);
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
  }

  #removePaginator() {
    this.itemsPaginator.innerHTML = '';
  }

  #handleChangeScreen() {
    this.#removePaginator();
    this.#createPaginator();
    this.#setCurrentPage();
  }
}

export default Paginator;
