import './dropdown.scss'

let dropdown = document.querySelector('.dropdown')
let dropdownInput = dropdown.querySelector('.dropdown__input')
let dropdownContent = dropdown.querySelector('.dropdown__content')

dropdownInput.addEventListener('click', (e) => {
  dropdownContent.classList.toggle('_active')
})

// Каунтер
const counter = dropdown.querySelector('.dropdown__counter')

const btnDecrement = counter.querySelectorAll('.dropdown__btn_decrement')
const btnIncrement = counter.querySelectorAll('.dropdown__btn_increment')

function checkLimits(countEl) {
  if (Number(countEl.innerText) > 999) countEl.innerText = 999
  if (Number(countEl.innerText) < 0) countEl.innerText = 0
}

function checkCounts() {
  const [...countItems] = document.querySelectorAll('.dropdown__count')
  let counts = countItems.map((e) => Number(e.innerText))
  let sum = counts.reduce((prev, curr) => prev + curr, 0)
  dropdownInput.value = `${sum} гостей`
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

    checkCounts()
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

    checkCounts()
  })
})

// Отображение количества в поле инпута
