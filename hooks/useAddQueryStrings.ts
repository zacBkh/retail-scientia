// need to pass current params with useSearchParams()
// we can pass null to remove the params

import { useCallback } from 'react'

const useAddQueryString = (searchParams: string) => {
  const addQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams)

      // If value is null or undefined, remove the parameter
      if (value === null || value === undefined) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  return addQueryString
}

export default useAddQueryString
