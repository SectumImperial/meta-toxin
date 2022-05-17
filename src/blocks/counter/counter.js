import './counter.scss'

const counter = document.querySelector('.counter')
const btnDecrement = counter.querySelectorAll('.counter__btn_decrement')
const btnIncrement = counter.querySelectorAll('.counter__btn_increment')

btnDecrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.counter__item')
    let count = container.querySelector('.counter__count')

    if (e.target.classList.contains('counter__btn_disabled')) return
    count.innerText = Number(count.innerText) - 1

    if (Number(count.innerText) === 0)
      e.target.classList.add('counter__btn_disabled')
  })
})

btnIncrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.counter__item')
    let count = container.querySelector('.counter__count')
    let decrement = container.querySelector('.counter__btn_decrement')

    if (Number(count.innerText) === 999) return
    count.innerText = Number(count.innerText) + 1

    if (Number(count.innerText) > 0)
      decrement.classList.remove('counter__btn_disabled')
  })
})
