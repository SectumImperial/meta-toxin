import chooseWord from '../../helpers/chooseWord';
import './room-card.scss';

document.querySelectorAll('.js-room-card').forEach((e) => {
  const count = Number(e.querySelector('.js-room-card__reviews-count').innerText);
  if (Number.isNaN(count)) return;
  const word = e.querySelector('.js-room-card__reviews-word');
  word.innerText = `${chooseWord(count, [
    'отзыв',
    'отзыва',
    'отзывов',
  ])}`;
});
