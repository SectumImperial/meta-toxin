import './ui-layout.scss';

function handleDocumentLoad() {
  if (document.querySelector('.ui-page')) {
    document.querySelector('.ui-page').style.minHeight = `${document.querySelector('.ui-page').clientHeight}px`;
  }
}
document.addEventListener('DOMContentLoaded', handleDocumentLoad);
