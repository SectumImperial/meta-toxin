import './dropdown.scss'
import ValidationError from './error.js'
import DEFAULT_KEY from './constants.js'

const dropdown = document.querySelector('.dropdown')
const dropdownInput = dropdown.querySelector('.dropdown__input')
const dropdownContent = dropdown.querySelector('.dropdown__content')

let options
try {
  options = JSON.parse(dropdownInput.dataset.options)
} catch (err) {
  throw new ValidationError('Ошибка в чтении options', err)
}

dropdownInput.addEventListener('click', (e) => {
  dropdownContent.classList.toggle('_active')
})

// Каунтер
const counter = dropdown.querySelector('.dropdown__counter')

const btnDecrement = counter.querySelectorAll('.dropdown__btn_decrement')
const btnIncrement = counter.querySelectorAll('.dropdown__btn_increment')

function checkLimits(countEl) {
  if (Number(countEl.innerText) > 999) countEl.innerText = 999
  if (Number(countEl.innerText) < 0) countEl.innerText = 0
}

function chooseWord(count, words) {
  const count100 = count % 100
  const count10 = count % 10

  if (count100 > 10 && count100 < 20) {
    return words[2]
  }
  if (count10 > 1 && count10 < 5) {
    return words[1]
  }
  if (count10 === 1) {
    return words[0]
  }
  return words[2]
}

function createString(count, word, input) {
  input.value = `${count} ${word}`
}

/**
 * Превращает объект в Map
 *
 * @param {object} obj - массив объектов с переданными данными для создани Map
 * @return Map
 */
function createObjectMap(arrObj) {
  let optMap = new Map()
  for (let obj of arrObj) {
    for (const [key, value] of Object.entries(obj)) {
      optMap.set(key, value)
    }
  }

  return optMap
}

/**
 * Находит все элементы по селектору с element.innerText > 0 и создаёт Map, где key: data-attr, value: element.innerText
 *
 * @param {string} selector - строка селектора counter
 * @return Map
 */
function createCountsMap(selector) {
  const countMap = new Map()
  const counts = [...document.querySelectorAll(selector)].filter(
    (e) => Number(e.innerText) > 0
  )
  for (let count of counts) {
    if (Number.isNaN(Number(count.innerText))) {
      throw new ValidationError('Ошибка в чтении значения counter', err)
    }
    countMap.set(count.dataset.item, Number(count.innerText))
  }

  return countMap
}

/**
 * Суммирует нужные значения counter и возвращает число.
 *
 * @param {Map} countsMap - Map counter
 * @param indicator - признак, по которому определяются НЕ нужные числа counter
 * @return {number} число
 */
function sumCounts(countsMap, wordsMap, indicator) {
  let arrKyes = []
  for (let [key, value] of countsMap) {
    if (key !== indicator && !wordsMap.has(key)) {
      arrKyes.push(value)
    }
  }
  let reusult = arrKyes.reduce((prev, curr) => Number(prev) + Number(curr), 0)
  return reusult
}

function isEqual(firstArr, secondArr) {
  if (!Array.isArray(firstArr) || !Array.isArray(secondArr)) {
    throw new ValidationError(
      'В сравнение массивов isEqual() передан НЕ массив'
    )
  }
  return (
    firstArr.length == secondArr.length &&
    firstArr.every((v, i) => v === secondArr[i])
  )
}
function hasIsEqualKey(compareMap, arr) {
  for (let [key] of compareMap) {
    if (isEqual(key, arr)) return true
  }

  return false
}

/**
 * Объединяет Map объекта слов и Map counter в новый Map, где key: массив слов опций,
 * value: сумма element.innerText совпадающео атрибута
 *
 * @param {Map} wordsMap - Map слов
 * @param {Map} countsMap - Map counter
 */
function joinMap(wordsMap, countsMap) {
  const synthMap = new Map()
  for (let [key, value] of countsMap) {
    // Если в карте массива слов есть отдельный массив для ключа
    if (wordsMap.has(key)) {
      // Если создаваемая карта не имеет такого ключа
      if (!hasIsEqualKey(synthMap, wordsMap.get(key))) {
        synthMap.set(wordsMap.get(key), value)
      }
    }

    // Если в карте массива слов нет отдельного массива для ключа
    if (!wordsMap.has(key)) {
      // Если создаваемая карта уже имеет нужный массив слов
      if (synthMap.has(wordsMap.get(DEFAULT_KEY))) {
        // перебрать и суммировать подходящие ключи countsMap, после установить в качестве value
        const value = sumCounts(countsMap, wordsMap, DEFAULT_KEY)
        synthMap.set(wordsMap.get(DEFAULT_KEY), value)
      }

      // Если создаваемая карта ещё не имеет нужный массив слов
      if (!synthMap.has(wordsMap.get(DEFAULT_KEY))) {
        synthMap.set(wordsMap.get(DEFAULT_KEY), value)
      }
    }
  }

  return synthMap
}

/**
 * Прохиодит по Map и создёт строку согласно ключу и значению всего Map
 *
 * @param {Map} map - Map с массивами слов и значениями
 * @return {[string]} Массив строк
 */
function createStrMap(map) {
  let arrStrings = []
  for (let [key, value] of map) {
    arrStrings.push(`${value} ${chooseWord(value, key)}`)
  }

  let result = arrStrings.join(', ')
  return result
}

function addInputValue(input, value) {
  input.value = value
}

/**
 * Обрабатывает данные counter и переданного объекта
 *
 * @param {string} selector - строка селектора counter
 * @param {Array} data - массив объектов с переданными данными для создани строки
 */
function performData(selector, data) {
  const wordsMap = createObjectMap(data)
  const countsMap = createCountsMap(selector)
  const synthMap = joinMap(wordsMap, countsMap)
  const string = createStrMap(synthMap)
  addInputValue(dropdownInput, string)
}

btnDecrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.dropdown__item')
    let count = container.querySelector('.dropdown__count')

    checkLimits(count)

    if (
      Number(count.innerText) > 0 &&
      e.target.classList.contains('dropdown__btn_disabled')
    )
      e.target.classList.remove('dropdown__btn_disabled')
    if (e.target.classList.contains('dropdown__btn_disabled')) return
    count.innerText = Number(count.innerText) - 1

    if (Number(count.innerText) === 0)
      e.target.classList.add('dropdown__btn_disabled')

    performData('.dropdown__count', options)
  })
})

btnIncrement.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault()

    let container = e.target.closest('.dropdown__item')
    let count = container.querySelector('.dropdown__count')
    let decrement = container.querySelector('.dropdown__btn_decrement')

    checkLimits(count)

    if (Number(count.innerText) === 999) return
    count.innerText = Number(count.innerText) + 1

    if (Number(count.innerText) > 0)
      decrement.classList.remove('dropdown__btn_disabled')

    performData('.dropdown__count', options)
  })
})

// Отображение количества в поле инпута
