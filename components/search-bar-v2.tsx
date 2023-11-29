import { FC, useRef } from 'react'

import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

import { TextField, IconButton } from '@radix-ui/themes'

import Spinner from './ui/spinner'

interface SearchBarMainProps {
  onSearch: (search: string) => void
  searchQuery: string
  isDateSet: number | undefined
  isSearching: boolean
}

const SearchBarMainV2: FC<SearchBarMainProps> = ({
  onSearch,
  searchQuery,
  isDateSet,
  isSearching,
}) => {
  const searchBarRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <TextField.Root className="w-full">
        <TextField.Slot>
          <AiOutlineSearch className={`text-[#99A1B3]`} />
        </TextField.Slot>

        <TextField.Input
          disabled={!isDateSet}
          id="searchBar"
          value={searchQuery}
          onChange={(evt) => onSearch(evt.target.value)}
          radius="small"
          variant="soft"
          type="search"
          size="3"
          placeholder="Search any product"
          ref={searchBarRef}
        />

        {searchQuery.length ? (
          <TextField.Slot>
            {isSearching ? (
              <IconButton size="1" variant="ghost">
                <Spinner style="border-gray-400 border-t-black !w-4 !h-4 mx-auto" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  onSearch('')
                  searchBarRef.current?.focus()
                }}
                size="1"
                variant="ghost"
              >
                <AiOutlineClose />
              </IconButton>
            )}
          </TextField.Slot>
        ) : (
          ''
        )}
      </TextField.Root>
    </>
  )
}

export default SearchBarMainV2
