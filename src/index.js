import './common/styles.scss';

const pages = [
  'start-page',
  'error-page',
  'ui-colors-type',
  'ui-cards',
  'ui-headers-footers',
  'ui-form-elements',
];

const files = [
  'registration',
  'login',
  'landing',
  'search-room',
  'room-details',
  'header',
  'footer',
  'nav',
  'button',
  'title',
  'text-element',
  'social',
  'booking-card',
  'datepicker',
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
  'review',
  'like',
  'rules',
  'order-card',
  'room-number',
  'room-price',
  'order-counting',
  'registration-card',
  'login-card',
  'ui-header',
  'subscription-field',
];

// eslint-disable-next-line global-require, import/no-dynamic-require
pages.forEach((e) => require(`./pages/${e}/index`));
// eslint-disable-next-line global-require, import/no-dynamic-require
files.forEach((e) => require(`./blocks/${e}/index`));
// eslint-disable-next-line global-require, import/no-dynamic-require
require('./layouts/page-layout/index');
require('./layouts/ui-layout/index');
