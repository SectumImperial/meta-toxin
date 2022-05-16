import './dropdown.scss'

let dropdown = document.querySelector('.dropdown')
let dropdownContent = dropdown.querySelector('.dropdown__content')

dropdown.addEventListener('click', (e) => {
  dropdownContent.classList.toggle('_active')
})
