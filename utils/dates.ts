// from Sun Nov 12 2023 15:10:54 GMT+0400 (heure du Golfe) TO 2023-11-12
export const dateToStringForQuery = (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

// takes 2023-11-12 and return Sunday, November 12, 2023
export const dateStringForQueryToDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleString('en-US', {
    dateStyle: 'full',
  })
  return formattedDate
}
