import './search-page.scss';

const filtersBtn = document.querySelector('.search-room__button');
const filters = document.querySelector('.search-room__filters');

if (filtersBtn && filters) {
  filtersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filters.classList.toggle('search-room__filters_active');
    if (filters.classList.contains('search-room__filters_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Скрыть фильтры';
    }
    if (!filters.classList.contains('search-room__filters_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Раскрыть фильтры';
    }
  });
}
