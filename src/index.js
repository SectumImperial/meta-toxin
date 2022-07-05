import './common/styles.scss'

require('./pages/start-page/start-page.js')
require('./pages/error-page/error-page.js')

require('./blocks/registration/registration.js')
require('./blocks/login/login.js')
require('./blocks/landing/landing.js')
require('./blocks/search-room/search-room.js')
require('./blocks/room-details/room-details.js')

require('./blocks/page-layout/page-layout.js')
require('./blocks/header/header.js')
require('./blocks/footer/footer.js')

require('./blocks/nav/nav.js')
require('./blocks/button/button.js')
require('./blocks/title/title.js')
require('./blocks/text-element/text-element.js')
require('./blocks/social/social.js')
require('./blocks/booking-card/booking-card.js')
require('./blocks/form/form.js')
require('./blocks/datepick/datepick.js')
require('./blocks/input/input.js')
require('./blocks/dropdown/dropdown.js')
require('./blocks/radio/radio.js')
require('./blocks/toggle/toggle.js')
require('./blocks/range-slider/range-slider.js')
require('./blocks/checkbox/checkbox.js')
require('./blocks/checkbox-list/checkbox-list.js')
require('./blocks/room-card/room-card.js')
require('./blocks/carousel/carousel.js')
require('./blocks/star-rating/star-rating.js')
require('./blocks/paginator/paginator.js')
require('./blocks/room-data/room-data.js')
require('./blocks/canvas/index.js')

import Dropdown from './blocks/dropdown/dropdown.js'
import CheckboxList from './blocks/checkbox-list/checkbox-list.js'
import Datepicker from './blocks/datepick/datepick.js'
import Carousel from './blocks/carousel/carousel'
import StarRating from './blocks/star-rating/star-rating'
import Paginator from './blocks/paginator/paginator.js'
import Slider from './blocks/range-slider/range-slider.js'

document.querySelectorAll('._js-dropdown').forEach((e) => new Dropdown(e))
document
  .querySelectorAll('._js-checkbox-list')
  .forEach((e) => new CheckboxList(e))
document.querySelectorAll('._datepick-js').forEach((e) => new Datepicker(e))
document.querySelectorAll('.carousel').forEach((e) => new Carousel(e))
document.querySelectorAll('.star-rating').forEach((e) => new StarRating(e))
document.querySelectorAll('.paginator').forEach((e) => new Paginator(e))
document.querySelectorAll('._js-range-slider').forEach((e) => new Slider(e))
