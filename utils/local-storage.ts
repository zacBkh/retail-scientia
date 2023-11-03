export const getSalesLSInJSObj = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.log('Server envt, Local Storage not available.')
    return null
  }

  const storedSalesJSON = localStorage.getItem('sales')

  const storedSalesObj: number[] = storedSalesJSON
    ? JSON.parse(storedSalesJSON)
    : []

  return storedSalesObj
}

export const checkIfRefIsInLS = (reference: number) => {
  const checkIfInCart = getSalesLSInJSObj()?.includes(reference)
  return checkIfInCart
}

export const countOccurenceOfRefInLS = (reference: number) => {
  const allSales = getSalesLSInJSObj()
  if (!allSales?.length) {
    console.log('Sales in LS is empty')
    return 0
  }

  const countOccurrence = allSales?.reduce(
    (acc, currValue) => (currValue === reference ? (acc += 1) : acc),
    0
  )

  return countOccurrence
}

export const addProductLocalStorage = (
  refToAlter: number,
  operator: '+' | '-'
) => {
  const storedSalesObj = getSalesLSInJSObj()

  // Add it to the array
  if (operator === '+') {
    storedSalesObj?.push(refToAlter)
    const updatedSalesJSON = JSON.stringify(storedSalesObj)
    localStorage.setItem('sales', updatedSalesJSON)
  } else {
    // If asked to remove
    const isRefAlreadyInLS = storedSalesObj?.includes(refToAlter)
    // If "-" && ref is not in array
    if (!isRefAlreadyInLS) {
      console.log('error not in LS and want to remove')
      return
    }

    // If in array, remove
    console.log('removed')
    return removeFromLocalStorageWithRef(refToAlter)
  }
}

// Remove from LS via ref
export const removeFromLocalStorageWithRef = (refToRemove: number) => {
  const allSales = getSalesLSInJSObj()

  // const newSales = allSales?.filter((sale) => sale !== refToRemove)
  const indexToRemove = allSales?.findIndex(
    (sale: number) => sale === refToRemove
  )

  if (indexToRemove === -1 || indexToRemove === undefined) {
    console.log('error 88')
    return
  }

  allSales?.splice(indexToRemove, 1)

  const updatedSalesJSON = JSON.stringify(allSales)
  localStorage.setItem('sales', updatedSalesJSON)
}

// Remove from LS via ref
export const clearLocalStorage = () => {
  localStorage.clear()
}
