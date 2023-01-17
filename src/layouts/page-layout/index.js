import './page-layout.scss';

if (document.querySelector('.page')) {
  document.querySelector('.page').style.minHeight = `${document.querySelector('.page').clientHeight}px`;
}
