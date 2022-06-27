import './search-room.scss'

import Dropdown from '../dropdown/dropdown'
import CheckboxList from '../checkbox-list/checkbox-list'

document.querySelectorAll('._js-dropdown').forEach((e) => {
  new Dropdown(e)
})

document.querySelectorAll('._js-checkbox-list').forEach((e) => {
  new CheckboxList(e)
})
