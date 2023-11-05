import { FC } from 'react'

import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

interface SearchBarMainProps {
  onSearch: (search: string) => void
  searchQuery: string
}

const SearchBarMain: FC<SearchBarMainProps> = ({ onSearch, searchQuery }) => {
  return (
    <div className="relative flex flex-1 justify-center items-center w-full 3xl:justify-center !h-fit">
      <div className="z-50 absolute left-[2%] flex justify-center items-center">
        {searchQuery ? (
          <AiOutlineClose
            className="align-middle text-[#99A1B3] shrink-0 w-[18px]"
            onClick={() => onSearch('')}
          />
        ) : (
          <AiOutlineSearch
            className={`align-middle text-[#99A1B3] shrink-0 w-[18px]`}
          />
        )}
      </div>
      <input
        id="mySearchInput"
        type="search"
        onChange={(evt) => onSearch(evt.target.value)}
        value={searchQuery}
        placeholder={'Start typing a product name'}
        className="p-2 pl-9 flex w-[100%] relative pr-1 py-1 h-10 outline-none focus:outline-orange-500 items-center text-left bg-gray-100"
      />
    </div>
  )
}

export default SearchBarMain
