import { FC, useState } from 'react'

import { Button, Flex, AlertDialog, Text, Checkbox } from '@radix-ui/themes'

import COLORS from '@/constants/colors-temp'
import { DISABLED_STYLE } from '@/constants/disabled-css'

interface AlertDialogRxProps {
  buttonTriggerTxt: string
  headerTxt: string
  bodyTxt: string
  bodyTxt2?: string
  btnConfirmTxt: string
  btnCancelTxt?: string
  salesDetails?: { date: string; ttlCartValue: number; ttlQty: number }

  isDisabled?: boolean

  onValidateAction: () => void
}

const AlertDialogRx: FC<AlertDialogRxProps> = ({
  buttonTriggerTxt,
  headerTxt,
  bodyTxt,
  btnConfirmTxt,
  btnCancelTxt,
  bodyTxt2,

  salesDetails,

  isDisabled,

  onValidateAction,
}) => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const handleCheckboxChange = (evt: boolean) => {
    setIsCheckboxChecked(evt)
  }

  const handleToggleDialog = (isDialogOpen: boolean) => {
    console.log('isDialogOpen', isDialogOpen)
  }

  const { date, ttlCartValue, ttlQty } = salesDetails ?? {}
  return (
    <>
      <AlertDialog.Root onOpenChange={handleToggleDialog}>
        <AlertDialog.Trigger disabled={isDisabled}>
          <button
            className={`bg-[#00a2c7] text-sm font-semibold text-center rounded text-white py-1 px-3`}
          >
            {buttonTriggerTxt}
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>{headerTxt}</AlertDialog.Title>

          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <AlertDialog.Description size="2">
                {bodyTxt}
              </AlertDialog.Description>
              {bodyTxt2 ? (
                <AlertDialog.Description size="2">
                  {bodyTxt2}
                </AlertDialog.Description>
              ) : (
                ''
              )}
            </div>

            {salesDetails ? (
              <div className="flex flex-col text-sm">
                <p>
                  You are registering your sales for the{' '}
                  <span className="font-semibold">{date}.</span>
                </p>
                <p>
                  The value for this day is{' '}
                  <span className="font-semibold">{ttlCartValue} </span>, for
                  <span className="font-semibold"> {ttlQty} products.</span>
                </p>
              </div>
            ) : (
              ''
            )}
          </div>

          <div className="mt-6">
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox onCheckedChange={handleCheckboxChange} /> I hereby
                confirm the information I entered are accurate.
              </Flex>
            </Text>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <button
                  className={`bg-[#0000330f] text-sm font-semibold text-center rounded text-[#0007149f] py-1 px-3`}
                >
                  {btnCancelTxt ?? 'Cancel'}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <button
                  onClick={onValidateAction}
                  disabled={!isCheckboxChecked}
                  className={`${DISABLED_STYLE} bg-[#e5484d] text-sm font-semibold text-center rounded text-white ${
                    isCheckboxChecked ? 'text-white' : 'text-[#0007149f]'
                  } py-2 px-3`}
                >
                  {btnConfirmTxt ?? 'Continue'}
                </button>
              </AlertDialog.Action>
            </Flex>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export default AlertDialogRx
