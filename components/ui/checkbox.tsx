import { FC } from 'react'

interface CkeckboxProps {
  isCheckboxChecked: boolean
  onCheckedChange: () => void
}

const Ckeckbox: FC<CkeckboxProps> = ({
  isCheckboxChecked,
  onCheckedChange,
}) => {
  return (
    <>
      <label className="flex items-start gap-x-2 text-sm">
        <input
          type="checkbox"
          className="!accent-[#00A2C7] mt-1"
          checked={isCheckboxChecked}
          onChange={onCheckedChange}
        />
        <span className="text-gray-700">
          I hereby confirm the information I entered are accurate.
        </span>
      </label>
    </>
  )
}

export default Ckeckbox
