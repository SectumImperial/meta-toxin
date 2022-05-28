import './dropdown.scss'

const dropdown = document.querySelector('.dropdown')
const dropdownInput = dropdown.querySelector('.dropdown__input')
const dropdownContent = dropdown.querySelector('.dropdown__content')

let options
try {
  options = JSON.parse(dropdownInput.dataset.options)
} catch (err) {
  console.error('Something wrong with input data')
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

function chooseWord(count, words) {
  const count100 = count % 100
  const count10 = count % 10

  if (count100 > 10 && count100 < 20) {
    return words[2]
  }
  if (count10 > 1 && count10 < 5) {
    return words[1]
  }
  if (count10 === 1) {
    return words[0]
  }
  return words[2]
}

function createString(count, words, input) {
  input.value = `${count} ${word}`
}

function checkUnique(e, allItems) {
  let { item } = e.dataset
  let itemsUnique = []

  allItems.forEach((obj) => {
    for (let key in obj) {
      if (obj[key] === item) {
        itemsUnique.push(e)
      }
    }
  })

  if (itemsUnique.length === 1) return itemsUnique[0]
  return itemsUnique
}

function checkCounts() {
  let arrUnique = []
  let arrOverall = []
  const [...countItems] = document.querySelectorAll('.dropdown__count')

  countItems.forEach((e) => {
    if (Number(e.innerText)) {
      let elemsUnique = checkUnique(e, options)
      if (elemsUnique.length > 0 || !Array.isArray(elemsUnique))
        arrUnique.push(elemsUnique)
    }
  })

  if (arrUnique.length === 1) {
    let itemUnique = arrUnique[0]
    arrOverall = countItems.filter((item) => item !== itemUnique)
  }
  // let sum = counts.reduce((prev, curr) => prev + curr, 0)
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
