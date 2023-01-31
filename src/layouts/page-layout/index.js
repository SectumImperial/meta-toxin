import './page-layout.scss';

function handleDocumentLoad() {
  if (document.querySelector('.page')) {
    document.querySelector('.page').style.minHeight = `${document.querySelector('.page').clientHeight}px`;
  }
}
document.addEventListener('DOMContentLoaded', handleDocumentLoad);
