import './search-room.scss'

import Dropdown from '../dropdown/dropdown'
document.querySelectorAll('._js-dropdown').forEach((e) => {
  new Dropdown(e)
})
