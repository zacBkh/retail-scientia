type SalesInLocalStorage = {
  ref: string
  qty: number
}[]

export const getLocalStorageJSONObj = (key: 'date' | 'sales') => {
  const storedDataJSON = localStorage.getItem(key)
  const storedDataObj: SalesInLocalStorage = storedDataJSON
    ? JSON.parse(storedDataJSON)
    : []

  return storedDataObj
}

export const checkIfRefIsInLS = (reference: string) => {
  const storedDataJSON = localStorage.getItem('sales')
  const storedDataObj: SalesInLocalStorage = storedDataJSON
    ? JSON.parse(storedDataJSON)
    : []

  const checkIfInCart = storedDataObj.some((item) => item.ref === reference)

  return checkIfInCart
}

export const addProductLocalStorage = (
  refToAlter: string,
  operator: '+' | '-'
) => {
  // Turn data into JS object
  const storedSalesJSON = localStorage.getItem('sales')
  const storedSalesObj: SalesInLocalStorage = storedSalesJSON
    ? JSON.parse(storedSalesJSON)
    : []

  // Find index of target ref
  const indexOfTargetRef = storedSalesObj.findIndex(
    (item) => item.ref === refToAlter
  )

  // If not yet in LS
  if (indexOfTargetRef === -1) {
    const toAdd = { ref: refToAlter, qty: 1 }
    storedSalesObj.push(toAdd)

    const updatedSalesJSON = JSON.stringify(storedSalesObj)
    localStorage.setItem('sales', updatedSalesJSON)

    // If already in LS
  } else {
    const targetObj = storedSalesObj[indexOfTargetRef]

    // If is gonna be 0, remove object from LS
    if (operator === '-' && targetObj.qty === 1) {
      return removeFromLocalStorageWithRef(refToAlter)
    }

    targetObj.qty += operator === '+' ? 1 : -1
    const updatedQtyJSON = JSON.stringify(storedSalesObj)
    localStorage.setItem('sales', updatedQtyJSON)
  }
}

// Remove from LS via Index
export const removeFromLocalStorageWithIndex = (indexToRemove: number) => {
  const allSales = getLocalStorageJSONObj('sales')
  allSales.splice(indexToRemove, 1) // removing the object
  console.log('has been deleted via index -->', indexToRemove)

  const updatedSalesJSON = JSON.stringify(allSales)
  localStorage.setItem('sales', updatedSalesJSON)
}

// Remove from LS via ref
export const removeFromLocalStorageWithRef = (reference: string) => {
  const allSales = getLocalStorageJSONObj('sales')

  const newSales = allSales.filter((sale) => sale.ref !== reference)
  const updatedSalesJSON = JSON.stringify(newSales)
  localStorage.setItem('sales', updatedSalesJSON)

  console.log('has been deleted via ref -->', reference)
}
