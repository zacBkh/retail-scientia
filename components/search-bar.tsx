import { FC, useRef } from 'react'

import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

import { TextField, IconButton } from '@radix-ui/themes'

interface SearchBarMainProps {
  onSearch: (search: string) => void
  searchQuery: string
  isDateSet: number | undefined
}

const SearchBarMain: FC<SearchBarMainProps> = ({
  onSearch,
  searchQuery,
  isDateSet,
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
          placeholder="Search any item"
          ref={searchBarRef}
        />

        {searchQuery.length ? (
          <TextField.Slot>
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
          </TextField.Slot>
        ) : (
          ''
        )}
      </TextField.Root>
    </>
  )
}

export default SearchBarMain
