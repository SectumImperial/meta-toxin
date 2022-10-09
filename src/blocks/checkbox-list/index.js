import CheckboxList from './Checkbox-list';
import './checkbox-list.scss';

document
  .querySelectorAll('.checkbox-list')
  .forEach((e) => new CheckboxList(e));
