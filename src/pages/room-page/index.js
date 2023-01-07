import chooseWord from '@helpers/chooseWord';
import './room-page.scss';

const reviewCount = document.querySelector('.room-page__reviews-count');
if (reviewCount) {
  const count = document.querySelectorAll('.review').length;
  reviewCount.innerText = `${count} ${chooseWord(count, [
    'отзыв',
    'отзыва',
    'отзывов',
  ])}`;
}
