import { FC, useRef } from 'react'

import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

import { TextField, IconButton } from '@radix-ui/themes'

interface SearchBarMainProps {
  onSearch: (search: string) => void
  searchQuery: string
}

const SearchBarMain: FC<SearchBarMainProps> = ({ onSearch, searchQuery }) => {
  const searchBarRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {/* <div className="relative flex flex-1 justify-center items-center w-full 3xl:justify-center !h-fit">
        <AiOutlineSearch
          className={`z-50 absolute text-[#99A1B3] w-[18px] left-[2%]`}
        />

        <AiOutlineClose
          className="z-50 absolute text-[#99A1B3] w-[18px] right-[2%] "
          onClick={() => {
            onSearch('')
            searchBarRef.current?.focus()
          }}
        />
        <input
          ref={searchBarRef}
          id="mySearchInput"
          type="search"
          onChange={(evt) => onSearch(evt.target.value)}
          value={searchQuery}
          placeholder={'Start typing a product name'}
          className="p-2 pl-9 md:pl-12 flex w-[100%] relative pr-1 py-1 h-10 outline-none focus:outline-orange-500 items-center text-left bg-gray-100"
        />
      </div> */}

      <TextField.Root className="w-full">
        <TextField.Slot>
          <AiOutlineSearch className={`text-[#99A1B3]`} />
        </TextField.Slot>

        <TextField.Input
          id="searchBar"
          value={searchQuery}
          onChange={(evt) => onSearch(evt.target.value)}
          radius="small"
          variant="soft"
          className=""
          type="search"
          size="3"
          placeholder="Start typing a product name"
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
