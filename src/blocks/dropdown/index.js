import './dropdown.scss'
import Dropdown from './Dropdown'

document.querySelectorAll('._js-dropdown').forEach((e) => new Dropdown(e))
