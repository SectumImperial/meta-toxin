import './checkbox-list.scss';
import CheckboxList from './Checkbox-list';

document
  .querySelectorAll('._js-checkbox-list')
  .forEach((e) => new CheckboxList(e));
