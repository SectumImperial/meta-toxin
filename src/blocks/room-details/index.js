import chooseWord from '../../helpers/chooseWord';
import './room-details.scss';

const reviewCount = document.querySelector('.room-details__reviews-count');
if (reviewCount) {
  const count = document.querySelectorAll('.review').length;
  reviewCount.innerText = `${count} ${chooseWord(count, [
    'отзыв',
    'отзыва',
    'отзывов',
  ])}`;
}
