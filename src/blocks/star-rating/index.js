import StarRating from './Star-rating';
import './star-rating.scss';

document.querySelectorAll('.star-rating').forEach((e) => new StarRating(e));
