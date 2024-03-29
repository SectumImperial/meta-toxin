import Inputmask from 'inputmask';

import './subscription-field.scss';

const inputMailSubscription = document.querySelectorAll('.subscription-field__input');

if (inputMailSubscription !== undefined && inputMailSubscription !== null) {
  inputMailSubscription.forEach((e) => {
    Inputmask('email', {
      mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
      greedy: false,
      showMaskOnHover: false,
      showMaskOnFocus: false,
      onBeforePaste(pastedValue) {
        const value = pastedValue.toLowerCase();
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
