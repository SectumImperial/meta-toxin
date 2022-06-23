import './range-slider.scss'

const slider = document.querySelector('._js-range-slider')
const fieldMin = document.querySelector('.range-slider__amount_min')
const fieldMax = document.querySelector('.range-slider__amount_max')
const toggleOne = document.querySelector('.range-slider__input_min')
const toggleTwo = document.querySelector('.range-slider__input_max')
const rangeProgress = document.querySelector('.range-slider__progress')

const MIN = 0
const MAX = 15000

if (slider) {
  toggleOne.value = '5000'
  toggleTwo.value = '10000'
  fieldMin.value = toggleOne.value
  fieldMax.value = toggleTwo.value

  rangeProgress.style.left = (toggleOne.value / MAX) * 100 + '%'
  rangeProgress.style.right = 100 - (toggleTwo.value / MAX) * 100 + '%'

  function colorRange() {
    rangeProgress.style.left = (toggleOne.value / MAX) * 100 + '%'
    rangeProgress.style.right = 100 - (toggleTwo.value / MAX) * 100 + '%'
  }

  toggleOne.addEventListener('input', (e) => {
    if (Number(toggleTwo.value) - Number(toggleOne.value) <= MIN) {
      toggleOne.value = Number(toggleTwo.value) - MIN
    }

    fieldMin.value = toggleOne.value
    colorRange()

    if (Number(toggleOne.value) === MAX && Number(toggleTwo.value) === MAX) {
      toggleTwo.style.display = 'none'
    } else {
      toggleTwo.style.display = 'block'
    }
  })

  toggleTwo.addEventListener('input', (e) => {
    if (Number(toggleTwo.value) - Number(toggleOne.value) <= MIN) {
      toggleTwo.value = Number(toggleOne.value) + MIN
    }

    fieldMax.value = toggleTwo.value
    colorRange()
  })
}
