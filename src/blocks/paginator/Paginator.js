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
    this.liClass = LI_CLASS;
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
    for (let i = start; i <= end; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addFirstPage();
      this.#addLastPage();
    }
    return this;
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
    return this;
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
    return this;
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
    return this;
  }

  #createEnding() {
    for (let i = this.pageCount - (COUNT_PAGE - 1); i <= this.pageCount; i += 1) {
      const li = this.#createLiElement(this.liClass, i);
      this.itemsPaginator.append(li);
    }

    if (this.mediaQueryList.matches) {
      this.#addFirstPage();
    }
    return this;
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

  /**
   *
   * @param {string} className
   * @param {number or string} content of li
   * @param {boolean} dot
   */
  #createLiElement(className, content, isDots = false) {
    const el = document.createElement('li');
    el.className = className;
    el.innerText = content;
    if (!isDots) {
      el.tabIndex = 0;
    }
    if (isDots) {
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
      this.buttonPrev.classList.add(HIDE);
      this.buttonPrev.tabIndex = '-1';
    }
    if (
      Number(activeItem.dataset.number) !== 1
      && this.buttonPrev.classList.contains(HIDE)
    ) {
      this.buttonPrev.classList.remove(HIDE);
      this.buttonPrev.tabIndex = '0';
    }

    if (Number(activeItem.dataset.number) === this.pageCount) {
      this.buttonNext.classList.add(HIDE);
      this.buttonNext.tabIndex = '-1';
    }
    if (
      Number(activeItem.dataset.number) !== this.pageCount
      && this.buttonNext.classList.contains(HIDE)
    ) {
      this.buttonNext.classList.remove(HIDE);
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
    if (!target.classList.contains(LI_CLASS)) return;
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
      `.${LI_CLASS}[data-number="${this.currentPage}"]`,
    );
    if (page === undefined || page === null) console.error('Current page has not found');
    return page;
  }

  #setCurrentPage() {
    const page = this.#findCurrentPage();
    page.classList.add(ACTIVE_LI);
    page.classList.add(ACTIVE_JS);

    this.#checkVisibilityBtn();
    this.#createText();
    return this;
  }

  #removePage() {
    const current = this.#findCurrentPage();
    current.classList.remove(ACTIVE_LI);
    current.classList.remove(ACTIVE_JS);
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
