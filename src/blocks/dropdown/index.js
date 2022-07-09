import './dropdown.scss';
import Dropdown from './Dropdown';

document.querySelectorAll('.js-dropdown').forEach((e) => new Dropdown(e));
