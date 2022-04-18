import './dropdown.scss'
import AirDatepicker from 'air-datepicker'
// import 'air-datepicker/air-datepicker.css'

const dateElems = document.querySelectorAll('.datepicker')
dateElems.forEach((e) => {
  let dp = new AirDatepicker(e, {
    autoClose: true,
    position({ $datepicker, $target, $pointer }) {
      let coords = $target.getBoundingClientRect(),
        dpHeight = $datepicker.clientHeight,
        dpWidth = $datepicker.clientWidth

      let top = coords.y + coords.height + 5
      let left = coords.x + coords.width / 2 - dpWidth / 2

      $datepicker.style.left = `${left}px`
      $datepicker.style.top = `${top}px`

      $pointer.style.display = 'none'
    },
  })
})
