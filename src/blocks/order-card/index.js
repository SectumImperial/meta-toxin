import './order-card.scss';
import OrderCard from './Order-card';

document.querySelectorAll('.order-card').forEach((e) => new OrderCard(e));
