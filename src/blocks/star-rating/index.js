import './star-rating.scss';
import StarRating from './Star-rating';

document.querySelectorAll('.star-rating').forEach((e) => new StarRating(e));
