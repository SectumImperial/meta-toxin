import OrderCard from './Order-card';
import './order-card.scss';

document.querySelectorAll('.order-card').forEach((e) => new OrderCard(e));
