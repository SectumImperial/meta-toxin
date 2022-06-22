import './range-slider.scss'

const slider = document.querySelector('._js-range-slider')
if (slider) {
  const progress = slider.querySelector('.range-slider__progress')
  const minToggle = slider.querySelector('.range-slider__min ')
  const maxToggle = slider.querySelector('.range-slider__max')

  const toggles = document.querySelectorAll('.range-slider__toggle')

  function moveToggle(event, toggle) {
    event.preventDefault() // предотвратить запуск выделения (действие браузера)

    let shiftX = event.clientX - toggle.getBoundingClientRect().left

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    function onMouseMove(event) {
      let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left

      // курсор вышел из слайдера => оставить бегунок в его границах.
      if (newLeft < 0) {
        newLeft = 0
      }
      let rightEdge = slider.offsetWidth - toggle.offsetWidth
      if (newLeft > rightEdge) {
        newLeft = rightEdge
      }

      toggle.style.left = newLeft + 'px'
    }

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }

  //   Навесить обработчики события на toggle
  toggles.forEach((toggle) => {
    toggle.addEventListener('mousedown', (event) => moveToggle(event, toggle))
    toggle.ondragstart = function () {
      return false
    }
  })
}
