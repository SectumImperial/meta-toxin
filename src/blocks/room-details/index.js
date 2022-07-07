import './room-details.scss'
import chooseWord from '../../helpers/chooseWord'

const reviewCount = document.querySelector('.room-details__reviews-count')
const count = document.querySelectorAll('.room-review').length
reviewCount.innerText = `${count} ${chooseWord(count, [
  'отзыв',
  'отзыва',
  'отзывов',
])}`
