import './common/styles.scss'

const pages = ['start-page', 'error-page']

const files = [
  'registration',
  'login',
  'landing',
  'search-room',
  'room-details',
  'page-layout',
  'header',
  'footer',
  'nav',
  'button',
  'title',
  'text-element',
  'social',
  'booking-card',
  'form',
  'datepick',
  'input',
  'dropdown',
  'radio',
  'toggle',
  'range-slider',
  'checkbox',
  'checkbox-list',
  'room-card',
  'carousel',
  'star-rating',
  'paginator',
  'room-data',
  'canvas',
  'room-review',
  'like',
  'room-rules',
  'order-card',
  'room-number',
  'room-price',
]

pages.forEach((e) => require(`./pages/${e}/index.js`))
files.forEach((e) => require(`./blocks/${e}/index.js`))
