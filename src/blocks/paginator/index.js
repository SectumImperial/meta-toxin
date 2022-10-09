import Paginator from './Paginator';
import './paginator.scss';

document.querySelectorAll('.paginator').forEach((e) => new Paginator(e));
