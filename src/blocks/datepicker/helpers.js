import Inputmask from 'inputmask';

function addMask(fields, isTwoInputs = false) {
  fields.forEach((e) => {
    if (isTwoInputs) {
      Inputmask('datetime', {
        alias: 'datetime',
        inputFormat: 'dd.mm.yyyy',
        placeholder: '__.__.____',
        showMaskOnHover: false,
        showMaskOnFocus: false,
        greedy: false,
      }).mask(e);
    }
  });
}

export default addMask;
