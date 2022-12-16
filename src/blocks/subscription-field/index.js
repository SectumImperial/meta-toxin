import Inputmask from 'inputmask';

import './subscription-field.scss';

const inputMailSubscription = document.querySelectorAll('.subscription-field__input');

if (inputMailSubscription) {
  inputMailSubscription.forEach((e) => {
    Inputmask('email', {
      mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
      greedy: false,
      showMaskOnHover: false,
      showMaskOnFocus: false,
      onBeforePaste(pastedValue) {
        let value = pastedValue;
        value = value.toLowerCase();
        return value.replace('mailto:', '');
      },
      definitions: {
        '*': {
          validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
          casing: 'lower',
        },
      },
    }).mask(e);
  });
}
