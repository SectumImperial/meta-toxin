import CheckboxList from './CheckboxList';
import './checkbox-list.scss';

document
  .querySelectorAll('.checkbox-list')
  .forEach((e) => new CheckboxList(e));
