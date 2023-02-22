function sumCount(options) {
  let sum = 0;
  options.forEach((option) => {
    if (!Number.isNaN(option.count)) sum += option.count;
    if (Number.isNaN(option.count)) sum += 0;
  });

  if (Number.isNaN(sum)) {
    console.error('Error in calculating the amount of votes Canvas');
  }
  return sum;
}

function addText(tag, text) {
  tag.insertAdjacentHTML('beforeend', text);
}

export {
  sumCount,
  addText,
};
