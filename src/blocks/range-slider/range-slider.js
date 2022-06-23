import './range-slider.scss'

const slider = document.querySelector('._js-range-slider')

if (slider) {
  const fieldMin = slider.querySelector('.range-slider__amount_min')
  const fieldMax = slider.querySelector('.range-slider__amount_max')
  const toggleOne = slider.querySelector('.range-slider__input_min')
  const toggleTwo = slider.querySelector('.range-slider__input_max')
  const rangeProgress = slider.querySelector('.range-slider__progress')

  let options
  try {
    options = JSON.parse(slider.dataset.rangeoptions)
  } catch (err) {
    throw new Error('Ошибка в чтении options')
  }

  const min = options.min ? options.min : 0
  const max = options.max ? options.max : 15000

  toggleOne.value = options.initialStart ? options.initialStart : min
  toggleTwo.value = options.initialEnd ? options.initialEnd : max
  fieldMin.value = toggleOne.value
  fieldMax.value = toggleTwo.value

  rangeProgress.style.left = (toggleOne.value / max) * 100 + '%'
  rangeProgress.style.right = 100 - (toggleTwo.value / max) * 100 + '%'

  function colorRange() {
    rangeProgress.style.left = (toggleOne.value / max) * 100 + '%'
    rangeProgress.style.right = 100 - (toggleTwo.value / max) * 100 + '%'
  }

  toggleOne.addEventListener('input', (e) => {
    if (Number(toggleTwo.value) - Number(toggleOne.value) <= min) {
      toggleOne.value = Number(toggleTwo.value) - min
    }

    fieldMin.value = toggleOne.value
    colorRange()

    if (Number(toggleOne.value) === max && Number(toggleTwo.value) === max) {
      toggleTwo.style.display = 'none'
    } else {
      toggleTwo.style.display = 'block'
    }
  })

  toggleTwo.addEventListener('input', (e) => {
    if (Number(toggleTwo.value) - Number(toggleOne.value) <= min) {
      toggleTwo.value = Number(toggleOne.value) + min
    }

    fieldMax.value = toggleTwo.value
    colorRange()
  })
}
