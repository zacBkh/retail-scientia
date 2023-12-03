import { Select } from '@radix-ui/themes'
import { FC } from 'react'

interface SelectProductLineProps {
  activeLine?: string // move to enum ??
}

const SelectProductLine: FC<SelectProductLineProps> = ({ activeLine }) => {
  return (
    <>
      <Select.Root>
        <Select.Trigger placeholder="Select Line" />
        <Select.Content position="popper">
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
        </Select.Content>
      </Select.Root>
    </>
  )
}

export default SelectProductLine
