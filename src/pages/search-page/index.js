import './search-page.scss';

const filtersBtn = document.querySelector('.search-page__button');
const filters = document.querySelector('.search-page__filters');

if (filtersBtn && filters) {
  filtersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filters.classList.toggle('search-page__filters_active');
    if (filters.classList.contains('search-page__filters_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Скрыть фильтры';
    }
    if (!filters.classList.contains('search-page__filters_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Раскрыть фильтры';
    }
  });
}
