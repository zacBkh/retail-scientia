import { FC, useState } from 'react'

import { Button, Flex, AlertDialog, Text, Checkbox } from '@radix-ui/themes'

interface AlertDialogRxProps {
  buttonTriggerTxt: string
  headerTxt: string
  bodyTxt: string
  bodyTxt2?: string
  btnConfirmTxt: string
  btnCancelTxt?: string
  salesDetails?: { date: string; totalValue: number }

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

  onValidateAction,
}) => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const handleCheckboxChange = (evt: boolean) => {
    setIsCheckboxChecked(evt)
  }

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button>{buttonTriggerTxt}</Button>
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
                  <span className="font-semibold">{salesDetails?.date}.</span>
                </p>
                <p>
                  The value for this day is{' '}
                  <span className="font-semibold">
                    {salesDetails?.totalValue}
                  </span>
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
                <Button variant="soft" color="gray">
                  {btnCancelTxt ?? 'Cancel'}
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  disabled={!isCheckboxChecked}
                  onClick={onValidateAction}
                  variant="solid"
                  color="red"
                >
                  {btnConfirmTxt ?? 'Continue'}
                </Button>
              </AlertDialog.Action>
            </Flex>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export default AlertDialogRx
