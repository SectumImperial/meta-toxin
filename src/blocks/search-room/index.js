import './search-room.scss';

const filtersBtn = document.querySelector('.js-search-room__button');
const filters = document.querySelector('.search-room__filters');

if (filtersBtn && filters) {
  filtersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filters.classList.toggle('_active');
    if (filters.classList.contains('_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Скрыть фильтры';
    }
    if (!filters.classList.contains('_active')) {
      filtersBtn.querySelector('.button__content').innerText = 'Раскрыть фильтры';
    }
  });
}
