import { RefObject, useEffect } from 'react'

// Takes the ref pointing to the div we want to watch clickOutside for and the handler

interface useOnClickOutsideTypes {
  (refOutside: RefObject<HTMLElement>, handler: Function): any
}

const useOnClickOutside: useOnClickOutsideTypes = (refOutside, handler) => {
  useEffect(() => {
    /* @ts-ignore */
    const listener = (event: MouseEvent) => {
      if (
        refOutside.current &&
        !refOutside.current.contains(event.target as Node)
      ) {
        handler()
      }
    }

    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  }, [refOutside, handler])
}

export default useOnClickOutside
