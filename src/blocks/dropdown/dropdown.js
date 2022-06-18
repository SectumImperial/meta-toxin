import './dropdown.scss'
import ValidationError from './helpers/error.js'
import chooseWord from './helpers/chooseWord'
import isEqual from './helpers/isEqual'
import cutString from './helpers/cutString'
import DEFAULT_KEY from './constants.js'

const dropdown = document.querySelector('.dropdown')
if (dropdown) {
  const dropdownInput = dropdown.querySelector('.dropdown__input')
  const dropdownContent = dropdown.querySelector('.dropdown__content')

  let btnClear = dropdown.querySelector('.dropdown__button_clear')
  let btnAccept = dropdown.querySelector('.dropdown__button_accept')

  btnClear.style.visibility = 'hidden'

  let options
  try {
    options = JSON.parse(dropdownInput.dataset.inputoptions)
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
    if (Number(countEl.value) > 999) countEl.value = 999
    if (Number(countEl.value) < 0) countEl.value = 0
  }

  function checkBtnVisibility(container, selector) {
    const [...counts] = container.querySelectorAll(selector)
    const countValues = []
    counts.forEach((e) => countValues.push(Number(e.value)))
    const sum = countValues.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    )

    if (sum > 0) btnClear.style.visibility = 'visible'
    if (sum === 0) btnClear.style.visibility = 'hidden'
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
   * Находит все элементы по селектору с element.value > 0 и создаёт Map, где key: data-attr, value: element.value
   *
   * @param {string} selector - строка селектора counter
   * @return Map
   */
  function createCountsMap(selector) {
    const countMap = new Map()
    const counts = [...document.querySelectorAll(selector)].filter(
      (e) => Number(e.value) > 0
    )
    for (let count of counts) {
      if (Number.isNaN(Number(count.value))) {
        throw new ValidationError('Ошибка в чтении значения counter', err)
      }
      countMap.set(count.dataset.item, Number(count.value))
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

  function hasIsEqualKey(compareMap, arr) {
    for (let [key] of compareMap) {
      if (isEqual(key, arr)) return true
    }

    return false
  }

  /**
   * Объединяет Map объекта слов и Map counter в новый Map, где key: массив слов опций,
   * value: сумма element.value совпадающео атрибута
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
    input.value = cutString(value, 20)
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
        Number(count.value) > 0 &&
        e.target.classList.contains('dropdown__btn_disabled')
      )
        e.target.classList.remove('dropdown__btn_disabled')
      if (e.target.classList.contains('dropdown__btn_disabled')) return
      count.value = Number(count.value) - 1

      if (Number(count.value) === 0)
        e.target.classList.add('dropdown__btn_disabled')

      performData('.dropdown__count', options)
      checkBtnVisibility(dropdown, '.dropdown__count')
    })
  })

  btnIncrement.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()

      let container = e.target.closest('.dropdown__item')
      let count = container.querySelector('.dropdown__count')
      let decrement = container.querySelector('.dropdown__btn_decrement')

      checkLimits(count)

      if (Number(count.value) === 999) return
      count.value = Number(count.value) + 1

      if (Number(count.value) > 0)
        decrement.classList.remove('dropdown__btn_disabled')

      performData('.dropdown__count', options)
      checkBtnVisibility(dropdown, '.dropdown__count')
    })
  })

  btnClear.addEventListener('click', (e) => {
    e.preventDefault()
    dropdownInput.value = ''

    const [...counts] = dropdown.querySelectorAll('.dropdown__count')
    counts.forEach((e) => (e.value = 0))
  })

  btnAccept.addEventListener('click', (e) => {
    e.preventDefault()
    dropdownContent.classList.remove('_active')
  })

  // Добавить значение из строки url, если они есть
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const dropdownUrlContent = urlParams.get('dropdown')

  if (dropdownUrlContent) {
    addInputValue(dropdownInput, dropdownUrlContent)

    let params = window.location.search
      .replace('?', '')
      .split('&')
      .reduce(function (p, e) {
        let a = e.split('=')
        p[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
        return p
      }, {})

    let allCounts = dropdown.querySelectorAll('.dropdown__count')
    allCounts.forEach((e) => {
      e.value = params[e.dataset.item]
    })

    checkBtnVisibility(dropdown, '.dropdown__count')
  }
}
