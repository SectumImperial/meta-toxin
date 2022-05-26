import './dropdown.scss'

const dropdown = document.querySelector('.dropdown')
const dropdownInput = dropdown.querySelector('.dropdown__input')
const dropdownContent = dropdown.querySelector('.dropdown__content')

let options
try {
  options = JSON.parse(dropdownInput.dataset.options)
} catch (err) {
  console.log('Something wrong with input data')
}

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

function createString(count, word) {
  return `${count} ${word}`
}

// function createValueInput(sum, arrayWords) {
// }

function checkCounts() {
  const [...countItems] = document.querySelectorAll('.dropdown__count')

  let infants = countItems.filter((e) => e.dataset.separate === 'true')
  console.log(infants)
  let infantsCounts = infants.map((e) => Number(e.innerText))
  let infantsSum = infantsCounts.reduce((prev, curr) => prev + curr, 0)
  console.log(infantsSum)

  let restCounts = countItems.filter((e) => e.dataset.separate === 'false')
  let counts = restCounts.map((e) => Number(e.innerText))
  let sum = counts.reduce((prev, curr) => prev + curr, 0)

  let result = `${createString(sum, 'Гостей')}, ${createString(
    infantsSum,
    'Младенцев'
  )}`
  dropdownInput.value = result
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
