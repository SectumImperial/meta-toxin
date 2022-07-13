function isEqual(firstArr, secondArr) {
  if (!Array.isArray(firstArr) || !Array.isArray(secondArr)) {
    throw new Error(
      'В сравнение массивов isEqual() передан НЕ массив',
    );
  }
  return (
    firstArr.length === secondArr.length
    && firstArr.every((v, i) => v === secondArr[i])
  );
}

export default isEqual;
