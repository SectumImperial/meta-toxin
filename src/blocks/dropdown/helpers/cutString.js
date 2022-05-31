const cutString = (str, num) => {
  const newStr = str
  if (str.length > num) {
    return `${str.slice(0, num + 1)}...`
  }
  return newStr
}

export default cutString
