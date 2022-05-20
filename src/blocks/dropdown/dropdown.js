import './dropdown.scss'

let dropdown = document.querySelector('.dropdown')
let dropdownContent = dropdown.querySelector('.dropdown__content')

dropdown.addEventListener('click', (e) => {
  if (!e.target.classList.contains('dropdown')) return
  dropdownContent.classList.toggle('_active')
})

// Каунтер
const counter = dropdown.querySelector('.dropdown__counter')

const btnDecrement = counter.querySelectorAll('.dropdown__btn_decrement')
const btnIncrement = counter.querySelectorAll('.dropdown__btn_increment')

const counts = document.querySelectorAll('.dropdown__count')
console.log(counts)

function checkLimits(countEl) {
  if (Number(countEl.innerText) > 999) countEl.innerText = 999
  if (Number(countEl.innerText) < 0) countEl.innerText = 0
}

btnDecrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.dropdown__item')
    let count = container.querySelector('.dropdown__count')

    checkLimits(count)

    if (
      Number(count.innerText) > 0 &&
      e.target.classList.contains('dropdown__btn_disabled')
    )
      e.target.classList.remove('dropdown__btn_disabled')
    if (e.target.classList.contains('dropdown__btn_disabled')) return
    count.innerText = Number(count.innerText) - 1

    if (Number(count.innerText) === 0)
      e.target.classList.add('dropdown__btn_disabled')

    console.log(counts)
  })
})

btnIncrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.dropdown__item')
    let count = container.querySelector('.dropdown__count')
    let decrement = container.querySelector('.dropdown__btn_decrement')

    checkLimits(count)

    if (Number(count.innerText) === 999) return
    count.innerText = Number(count.innerText) + 1

    if (Number(count.innerText) > 0)
      decrement.classList.remove('dropdown__btn_disabled')
  })
})
