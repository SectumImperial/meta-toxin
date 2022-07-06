import './carousel.scss'
import Carousel from './Carousel'

document.querySelectorAll('.carousel').forEach((e) => new Carousel(e))
