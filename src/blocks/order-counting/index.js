import './order-counting.scss'
import OrderCount from './Order-counitng'

document.querySelectorAll('.order-counting').forEach((e) => new OrderCount(e))
