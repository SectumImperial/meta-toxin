function chooseWord(count, words) {
  const count100 = count % 100;
  const count10 = count % 10;

  if (count100 > 10 && count100 < 20) {
    return words[2];
  }
  if (count10 > 1 && count10 < 5) {
    return words[1];
  }
  if (count10 === 1) {
    return words[0];
  }
  return words[2];
}

export default chooseWord;
