const getMap = (arr, result, keyName = 'id', childName = 'children') => {
  arr.map((val) => {
    result[val[keyName]] = {...val}
    if (val[childName]) {
      getMap(val[childName], result)
    }
  })
}

const isNumber = (input) => {
  return !isNaN(parseFloat(input)) && isFinite(input)
}

export default {
  getMap,
  isNumber
}
